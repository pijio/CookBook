namespace CookBook.App.Models.Interfaces
{
    public interface IMapped
    {
        string TableName { get; }
        string SchemaName { get; }
        public int Id { get; set; }
    }
}