using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Text;
using CookBook.App.Models.Interfaces;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.Data.SqlClient;

namespace CookBook.App.Services
{
    public class CrudService<T> : ICrudService<T> where T : IMapped
    {
        private readonly  List<KeyValuePair<string, Type>> _properties;
        private readonly IConfigurationService _configurationService;
        private readonly string _connectionString;
        private readonly string _genericTableName;
        private readonly string[] _hidedProps = { "Id" };
        public CrudService(IConfigurationService configurationService)
        {
            _properties = InitializeProperties().ToList();
            _configurationService = configurationService;
            _connectionString = _configurationService.GetConnectionString("MSSql");
            _genericTableName = GetTableName();
            if (string.IsNullOrEmpty(_genericTableName))
                throw new InvalidOperationException("T не содержит атрибута TableAttribute!");
        }

        private string GetTableName()
        {
            return typeof(T).GetCustomAttribute<TableAttribute>()?.Name;
        }

        private TPropValue GetValueFromInstance<TPropValue>(T instance, string propertyName)
        {
            return (TPropValue)typeof(T).GetProperty(propertyName)?.GetValue(instance);
        }
        
        private object GetValueFromInstance(T instance, string propertyName)
        {
            return typeof(T).GetProperty(propertyName)?.GetValue(instance);
        }
        
        private IEnumerable<KeyValuePair<string, Type>> InitializeProperties()
        {
            return typeof(T).GetProperties().Where(x => x.CanRead && x.CanWrite)
                .Select(x => new KeyValuePair<string, Type>(x.Name, x.PropertyType));
        }

        public int Create(T entry)
        {
            ExecuteActionInSql(connection =>
            {
                var expression = new StringBuilder($"INSERT INTO {_genericTableName} ");
                var props = _properties.Where(x => !_hidedProps.Contains(x.Key)).ToList();
                if (props.Count == 0)
                {
                    expression.Append("DEFAULT VALUES");
                }
                else
                {
                    expression.Append("(");
                    for (int i = 0; i < props.Count; i++)
                    {
                        expression.Append(props[i].Key);
                        expression.Append(i == props.Count - 1 ? ") " : ",");
                    }
                
                    expression.Append("VALUES (");
                    var type = typeof(T);
                    for (int i = 0; i < props.Count; i++)
                    {
                        var prop = type.GetProperty(props[i].Key);
                        var value = Convert.ChangeType(prop?.GetValue(entry), props[i].Value);
                        if (props[i].Value == typeof(decimal))
                        {
                            value = ((decimal)value).ToString("0.00", System.Globalization.CultureInfo.InvariantCulture);
                            expression.Append(value);
                        }
                        else
                        {
                            expression.Append(props[i].Value == typeof(string) || props[i].Value == typeof(DateTime) ? $"'{value}'" : value);   
                        }
                        expression.Append(i == props.Count - 1 ? ")" : ",");
                    }
                }
                var command = new SqlCommand(expression.ToString(), connection);
                command.ExecuteNonQuery();
            });

            var id = 0;
            ExecuteActionInSql(connection =>
            {
                var expression = new StringBuilder($"SELECT IDENT_CURRENT('{_genericTableName}')");
                var command = new SqlCommand(expression.ToString(), connection);
                var reader =  command.ExecuteReader();
                if (reader.HasRows && reader.Read())
                {
                    id = Convert.ToInt32(reader[0].ToString());
                }
            });
            return id;
        }

        public IEnumerable<T> Read()
        {
            // ado.net logic
            string expression = "SELECT * FROM " + $"{_genericTableName}";
            var result = new List<T>();
            ExecuteActionInSql(connection =>
            {
                var command = new SqlCommand(expression, connection);
                var reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        var instance = Activator.CreateInstance<T>();
                        foreach (var props in _properties)
                        {
                            SetValueToInstance(instance, props.Key, props.Value, reader[props.Key]);
                        }
                        result.Add(instance);
                    }
                }
            });
            return result;
        }

        private void SetValueToInstance(T instance, string propertyName, Type propertyType, object value)
        {
            var prop = typeof(T).GetProperty(propertyName);
            if (prop != null)
            {
                prop.SetValue(instance, Convert.ChangeType(value, propertyType));
            }
        }
        
        public void Update(T updatedEntry)
        {
            // ado.net logic
            ExecuteActionInSql(connection =>
            {
                var expression =
                    $"SELECT * FROM {_genericTableName} WHERE Id={GetValueFromInstance<int>(updatedEntry, "Id")}";
                var command = new SqlCommand(expression, connection);
                var reader = command.ExecuteReader();
                if (!reader.HasRows)
                {
                    reader.Dispose();
                    throw new Exception("Запись не найдена!");
                }
                reader.Close();
                var updateExpression = new StringBuilder($"UPDATE {_genericTableName} SET ");
                var props = _properties.Where(x => !_hidedProps.Contains(x.Key)).ToList();
                for(int i=0; i<props.Count; i++)
                {
                    var reflected = GetValueFromInstance(updatedEntry, props[i].Key);
                    var value = props[i].Value == typeof(string) ? $"'{reflected}'" : reflected.ToString(); 
                    updateExpression.Append($"{props[i].Key}={value}");
                    updateExpression.Append(i == props.Count - 1 ? " " : ",");
                }
                updateExpression.Append($"WHERE Id={GetValueFromInstance<int>(updatedEntry, "Id")}");
                command = new SqlCommand(updateExpression.ToString(), connection);
                command.ExecuteNonQuery();
            });
        }

        public void Delete(T entry)
        {
            // ado.net logic
            ExecuteActionInSql(connection =>
            {
                var expression =
                    $"SELECT * FROM {_genericTableName} WHERE Id={GetValueFromInstance<int>(entry, "Id")}";
                var command = new SqlCommand(expression, connection);
                var reader = command.ExecuteReader();
                if (!reader.HasRows)
                {
                    reader.Dispose();
                    throw new Exception("Запись не найдена!");
                }
                reader.Close();
                var updateExpression = new StringBuilder($"DELETE {_genericTableName} ");
                updateExpression.Append($"WHERE Id={GetValueFromInstance<int>(entry, "Id")}");
                command = new SqlCommand(updateExpression.ToString(), connection);
                command.ExecuteNonQuery();
            });
        }

        public void ExecuteActionInSql(Action<SqlConnection> action)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    action.Invoke(connection);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}