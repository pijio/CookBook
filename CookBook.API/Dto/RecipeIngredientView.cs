namespace CookBook.API.Dto
{
    public class RecipeIngredientView
    {
        public int? RecipeIngredientId { get; set; } 
        public IngredientView Ingredient { get; set; }
        public decimal CountOf { get; set; }
    }
}