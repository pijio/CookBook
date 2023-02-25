using System.ComponentModel.DataAnnotations.Schema;
using CookBook.App.Models.Interfaces;

namespace CookBook.App.Models
{
    [Table("dbo.Recipes")]
    public class Recipe : IMapped
    {
        public int Id { get; set; }
        public string RecipeName { get; set; }
        public string RecipeComment { get; set; }
    }
}