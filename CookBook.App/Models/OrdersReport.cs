using System.Collections.Generic;

namespace CookBook.App.Models
{
    public class OrdersReport
    {
        public IEnumerable<IngredientsReportRow> IngredientsPart { get; set; }
        public IEnumerable<DishReportRow> DishPart { get; set; }
    }

    public class IngredientsReportRow
    {
        public string IngredientName { get; set; }
        public decimal InIngredients { get; set; }
        public string MeasureSymbol { get; set; }
        public decimal InMoney { get; set; }
    }

    public class DishReportRow
    {
        public string RecipeName { get; set; }
        public decimal CountOf { get; set; }
    }
}