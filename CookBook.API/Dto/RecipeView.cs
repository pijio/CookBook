namespace CookBook.API.Dto
{
    public class RecipeView
    {
        public int Id { get; set; }
        public string RecipeName { get; set; }
        public string RecipeComment { get; set; }
        public RecipeIngredientView[] Ingredients { get; set; }
    }
}