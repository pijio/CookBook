using System.ComponentModel.DataAnnotations.Schema;
using CookBook.App.Models.Interfaces;

namespace CookBook.App.Models
{
    [Table("dbo.OrderItems")]
    public class OrderItem : IMapped
    {
        public int Id { get; set; }
        
        public int OrderId { get; set; }
        
        public int RecipeId { get; set; }
        
        public int CountOf { get; set; }
    }
}