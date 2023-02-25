using System.ComponentModel.DataAnnotations.Schema;
using CookBook.App.Models.Interfaces;

namespace CookBook.App.Models
{
    [Table("dbo.RecipesIngredients")]
    public class RecipeIngredient : IMapped
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public int IngredientId { get; set; }
        public decimal CountOf { get; set; }
    }
}