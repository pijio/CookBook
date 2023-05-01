using System;
using CookBook.API.Dto;
using CookBook.App;
using CookBook.App.Models;
using CookBook.App.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Order = CookBook.App.Models.Order;

namespace CookBook.API.Controllers
{
    [EnableCors("ApiPolicy")]
    [Route("/api/orders")]
    [ApiController]
    public class OrdersController : Controller
    {
        private ICrudService<Order> _ordersCrud;
        private ICrudService<OrderItem> _orderItemsCrud;

        public OrdersController(ICrudService<OrderItem> orderItemsCrud, ICrudService<Order> ordersCrud)
        {
            _orderItemsCrud = orderItemsCrud;
            _ordersCrud = ordersCrud;
        }

        [HttpPost("makeorder")]
        public IActionResult MakeOrder(OrderView orderView)
        {
            var order = new Order()
            {
                OrderDate = DateTime.Today
            };
            var orderId = _ordersCrud.Create(order);
            foreach (var item in orderView.Items)
            {
                var orderItem = new OrderItem()
                {
                    OrderId = orderId,
                    CountOf = item.CountOf,
                    RecipeId = item.RecipeId
                };
                _orderItemsCrud.Create(orderItem);
            }

            return Ok();
        }
        
        [HttpGet("getReport")]
        public IActionResult GetReport([FromQuery] DateTime from, [FromQuery] DateTime to, [FromServices] IReportService reportService)
        {
            var stream = reportService.GetOrdersReport(from, to);
            var result = new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            return result;
        } 
    }
}