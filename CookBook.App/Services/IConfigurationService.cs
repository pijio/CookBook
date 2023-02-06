namespace CookBook.App
{
    public interface IConfigurationService
    {
        string GetValue(string key);
        string GetConnectionString(string connectStringName);
    }
}