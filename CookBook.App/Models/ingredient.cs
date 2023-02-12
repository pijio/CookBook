using System.ComponentModel.DataAnnotations.Schema;
using CookBook.App.Models.Interfaces;

namespace CookBook.App.Models
{
    [Update("dbo.UpdateZalupa")]
    [Create("dbo.CreateZalupa")]
    [Delete("dbo.DeleteZalupa")]
    [Read("dbo.ReadZalupa")]
    [Table("dbo.Ingredients")]
    public class Ingredient : IMapped
    {
        public int Id { get; set; }
        public string IngredientName { get; set; }
    }
}