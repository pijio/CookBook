using System.Linq;
using System.Threading.Tasks;
using CookBook.App;
using CookBook.App.Models;
using CookBook.App.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace CookBook.API.Controllers
{
    [EnableCors("ApiPolicy")]
    [Route("/api")]
    [ApiController]
    public class CRUDController : Controller
    {
        private readonly ICrudService<Ingredient> _crudIngredients;

        public CRUDController(ICrudService<Ingredient> crudIngredients)
        {
            _crudIngredients = crudIngredients;
        }

        [HttpGet("getIngredients")]
        public Ingredient[] GetIngredients()
        {
            return _crudIngredients.Read().ToArray();
        }
        
        [HttpGet("addIngredients")]
        public IActionResult CreateIngredients()
        {
            _crudIngredients.Create(new Ingredient() { IngredientName = "Картошка" });
            return Ok();
        }
        
        [HttpGet("updateIngredient")]
        public IActionResult UpdateIngredients()
        {
            _crudIngredients.Update(new Ingredient { Id = 3, IngredientName = "Помидор" });
            return Ok();
        }

        [HttpGet("deleteIngredient")]
        public IActionResult DeleteIngrediets()
        {
            _crudIngredients.Delete(new Ingredient { Id = 3, IngredientName = "Помидор" });
            return Ok();
        }
    }
}