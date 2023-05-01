namespace CookBook.API.Dto
{
    public class OrderView
    {
        public OrderViewItem[] Items { get; set; }
    }

    public class OrderViewItem
    {
        public int RecipeId { get; set; }
        public int CountOf { get; set; }
    }
}