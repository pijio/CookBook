using CookBook.App;
using Microsoft.Extensions.Configuration;

namespace CookBook.API.Services
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly IConfiguration _configuration;

        public ConfigurationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetValue(string key)
        {
            return _configuration[key];
        }

        public string GetConnectionString(string connectStringName)
        {
            return _configuration.GetConnectionString(connectStringName);
        }
    }
}