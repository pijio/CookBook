using System.IO;

namespace CookBook.App.Services
{
    public interface IReportService
    {
        MemoryStream GetRecipesReport(int portions);
    }
}