using System.ComponentModel.DataAnnotations.Schema;
using CookBook.App.Models.Interfaces;

namespace CookBook.App.Models
{
    [Table("dbo.Ingredients")]
    public class Ingredient : IMapped
    {
        public int Id { get; set; }
        public string IngredientName { get; set; }
        public int MeasureId { get; set; }
        public decimal Price { get; set; }
    }
}