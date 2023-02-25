using CookBook.App.Models;

namespace CookBook.API.Dto
{
    public class IngredientView
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MeasureId { get; set; }
        public string MeasureName { get; set; }
        public string MeasureSymbol { get; set; }
        public decimal Price { get; set; }
        
        public static explicit operator Ingredient(IngredientView dto)
        {
            return new Ingredient() { Id = dto.Id, Price = dto.Price, MeasureId = dto.MeasureId, IngredientName = dto.Name};
        }
    }
}