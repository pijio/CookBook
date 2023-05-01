using System;
using System.IO;

namespace CookBook.App.Services
{
    public interface IReportService
    {
        MemoryStream GetRecipesReport(int portions);
        MemoryStream GetOrdersReport(DateTime from, DateTime to);
    }
}