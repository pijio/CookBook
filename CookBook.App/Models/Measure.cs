using System.ComponentModel.DataAnnotations.Schema;

namespace CookBook.App.Models.Interfaces
{
    [Table("dbo.Measures")]
    public class Measure : IMapped
    {
        public int Id { get; set; }
        public string MeasureName { get; set; }
        public string MeasureSymbol { get; set; }
    }
}