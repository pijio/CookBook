namespace CookBook.App.Models
{
    public class RecipesReportRow
    {
        public string RecipeName { get; set; }
        public string IngredientName { get; set; }
        public decimal TotalCount { get; set; }
        public string MeasureName { get; set; }
        public string MeasureSymbol { get; set; }       
        public decimal TotalPrice { get; set; }

    }
}