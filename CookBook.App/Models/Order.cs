using System;
using System.ComponentModel.DataAnnotations.Schema;
using CookBook.App.Models.Interfaces;

namespace CookBook.App.Models
{
    [Table("dbo.Orders")]
    public class Order : IMapped
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
    }
}