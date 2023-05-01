using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using ClosedXML.Excel;
using CookBook.App.Models;
using Microsoft.Data.SqlClient;

namespace CookBook.App.Services
{
    public class ReportService : IReportService
    {
        private readonly IConfigurationService _configurationService;
        public ReportService(IConfigurationService configurationService)
        {
            _configurationService = configurationService;
        }
        
        public MemoryStream GetRecipesReport(int portions)
        {
            var data = GetReportData(portions).ToList();
            var interimResults = from row in data
                group row by row.RecipeName
                into gr
                select new { RecipeName = gr.Key, TotalSum = gr.Sum(x => x.TotalPrice) };
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Отчет в разрезе рецептов");
                worksheet.ColumnWidth = 34;
                worksheet.Cell(3, 1).Style.Font.Bold = true;
                worksheet.Cell(3, 1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet.Cell(3, 1).Value = $"Отчет в разрезе рецептов";
                worksheet.Range(3, 1, 3, 5).Row(1).Merge();
                var currentRow = 5;
                foreach (var interimRes in interimResults)
                {
                    var ingredients = data.Where(x => x.RecipeName == interimRes.RecipeName);
                    worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 1).Value = $"{interimRes.RecipeName}";
                    worksheet.Range(currentRow, 1, currentRow, 5).Row(1).Merge();
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 1).Value = $"Наименование ингридиента";
                    worksheet.Cell(currentRow, 2).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 2).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 2).Value = $"Количество на {portions} порций";
                    worksheet.Cell(currentRow, 3).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 3).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 3).Value = $"Единица измерения ингредиента";
                    worksheet.Cell(currentRow, 4).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 4).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 4).Value = $"Символ единицы измерения";
                    worksheet.Cell(currentRow, 5).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 5).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                    worksheet.Cell(currentRow, 5).Value = $"Стоимость ингридиента на {portions} порций";
                    currentRow++;
                    foreach (var ingredient in ingredients)
                    {
                        worksheet.Cell(currentRow, 1).Value = ingredient.IngredientName;
                        worksheet.Cell(currentRow, 2).Value = ingredient.TotalCount;
                        worksheet.Cell(currentRow, 3).Value = ingredient.MeasureName;
                        worksheet.Cell(currentRow, 4).Value = ingredient.MeasureSymbol;
                        worksheet.Cell(currentRow, 5).Value = ingredient.TotalPrice;
                        currentRow++;
                    }
                    worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 1).Value = $"Итого:";
                    worksheet.Cell(currentRow, 5).Style.Font.Bold = true;
                    worksheet.Cell(currentRow, 5).Value = $"{interimRes.TotalSum} сом.";
                    currentRow += 2;
                }

                var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Flush();
                stream.Position = 0;
                return stream;
            }
        }

        public MemoryStream GetOrdersReport(DateTime from, DateTime to)
        {
            var data = GetReportData(from, to);
            var totalForPeriod = data.IngredientsPart.Sum(x => x.InMoney);
            using (var workbook = new XLWorkbook())
            {
                // в разрезе ингридиентов
                var worksheet = workbook.Worksheets.Add("Ингридиенты на заказы");
                worksheet.ColumnWidth = 34;
                worksheet.Cell(3, 1).Style.Font.Bold = true;
                worksheet.Cell(3, 1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet.Cell(3, 1).Value = $"Отчет в разрезе ингридиентов по заказам с {from.Date:dd/MM/yyyy} по {to.Date:dd/MM/yyyy}";
                worksheet.Range(3, 1, 3, 4).Row(1).Merge();
                var currentRow = 5;
                worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
                worksheet.Cell(currentRow, 1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet.Cell(currentRow, 1).Value = "Наименование ингридиента";
                worksheet.Cell(currentRow, 2).Style.Font.Bold = true;
                worksheet.Cell(currentRow, 2).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet.Cell(currentRow, 2).Value = "Количество затраченного продукта";
                worksheet.Cell(currentRow, 3).Style.Font.Bold = true;
                worksheet.Cell(currentRow, 3).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet.Cell(currentRow, 3).Value = "Единица измерения ингредиента";
                worksheet.Cell(currentRow, 4).Style.Font.Bold = true;
                worksheet.Cell(currentRow, 4).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet.Cell(currentRow, 4).Value = "Цена ингридиенты";
                currentRow++;
                foreach (var ingredient in data.IngredientsPart)
                {
                    worksheet.Cell(currentRow, 1).Value = ingredient.IngredientName;
                    worksheet.Cell(currentRow, 2).Value = ingredient.InIngredients;
                    worksheet.Cell(currentRow, 3).Value = ingredient.MeasureSymbol;
                    worksheet.Cell(currentRow, 4).Value = ingredient.InMoney;
                    currentRow++;
                }
                worksheet.Cell(currentRow, 1).Style.Font.Bold = true;
                worksheet.Cell(currentRow, 1).Value = "Итого:";
                worksheet.Cell(currentRow, 4).Value = $"{totalForPeriod} ден. ед.";
                
                var worksheet2 = workbook.Worksheets.Add("Заказы в целом");
                worksheet2.ColumnWidth = 34;
                worksheet2.Cell(3, 1).Style.Font.Bold = true;
                worksheet2.Cell(3, 1).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet2.Cell(3, 1).Value = $"Отчет по заказам в целом с {from.Date:dd/MM/yyyy} по {to.Date:dd/MM/yyyy}";
                worksheet2.Range(3, 1, 3, 4).Row(1).Merge();
                currentRow = 5;
                worksheet2.Cell(currentRow, 2).Style.Font.Bold = true;
                worksheet2.Cell(currentRow, 2).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet2.Cell(currentRow, 2).Value = "Наименование блюда";
                worksheet2.Cell(currentRow, 3).Style.Font.Bold = true;
                worksheet2.Cell(currentRow, 3).Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Center);
                worksheet2.Cell(currentRow, 3).Value = "Заказано за период";
                currentRow++;
                foreach (var dish in data.DishPart)
                {
                    worksheet2.Cell(currentRow, 2).Value = dish.RecipeName;
                    worksheet2.Cell(currentRow, 3).Value = dish.CountOf;
                    currentRow++;
                }

                var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Flush();
                stream.Position = 0;
                return stream;
            }
        }

        private IEnumerable<RecipesReportRow> GetReportData(int portions)
        {
            // название процедуры
            const string sqlExpression = "RecipesReport";

            using var connection = new SqlConnection(_configurationService.GetConnectionString("MSSql"));
            connection.Open();
            var command = new SqlCommand(sqlExpression, connection);
            command.CommandType = System.Data.CommandType.StoredProcedure;
            var sqlParams = new SqlParameter
            {
                ParameterName = "@Portions",
                Value = portions
            };
            command.Parameters.Add(sqlParams);
            var result = new List<RecipesReportRow>();
            var reader = command.ExecuteReader();
 
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    var row = new RecipesReportRow
                    {
                        RecipeName = reader.GetString(0),
                        IngredientName = reader.GetString(1),
                        TotalCount = reader.GetDecimal(2),
                        MeasureName = reader.GetString(3),
                        MeasureSymbol = reader.GetString(4),
                        TotalPrice = reader.GetDecimal(5)
                    };
                    result.Add(row);
                }
            }
            reader.Close();
            return result.OrderBy(x => x.RecipeName);
        }
        
        private OrdersReport GetReportData(DateTime from, DateTime to)
        {
            // название процедуры
            const string sqlExpression = "OrdersReport";
            var connectionString = _configurationService.GetConnectionString("MSSql");
            var result = new OrdersReport();
            var ingredientsRows = new List<IngredientsReportRow>();
            var dishRows = new List<DishReportRow>();
            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand(sqlExpression, connection);
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@StartDate", from);
                command.Parameters.AddWithValue("@EndDate", to);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var ingredientName = (string)reader["IngredientName"];
                        var inIngredients = (decimal)reader["InIngredients"];
                        var measureSymbol = (string)reader["MeasureSymbol"];
                        var inMoney = (decimal)reader["InMoney"];

                        ingredientsRows.Add(new IngredientsReportRow()
                        {
                            IngredientName = ingredientName,
                            InIngredients = inIngredients,
                            MeasureSymbol = measureSymbol,
                            InMoney = inMoney
                        });
                    }

                    // Переходим к следующему набору результатов
                    reader.NextResult();

                    while (reader.Read())
                    {
                        var recipeName = (string)reader["RecipeName"];
                        var countOf = (int)reader["CountOf"];
                        dishRows.Add(new DishReportRow
                        {
                            RecipeName = recipeName,
                            CountOf = countOf
                        });
                    }
                }

                result.IngredientsPart = ingredientsRows;
                result.DishPart = dishRows;
                return result;
            }
        }
    }
}