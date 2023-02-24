using System.Linq;
using System.Threading.Tasks;
using CookBook.API.Dto;
using CookBook.App;
using CookBook.App.Models;
using CookBook.App.Models.Interfaces;
using CookBook.App.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace CookBook.API.Controllers
{
    [EnableCors("ApiPolicy")]
    [Route("/api/ingredients")]
    [ApiController]
    public class IngredientsController : Controller
    {
        private readonly ICrudService<Ingredient> _crudIngredients;

        public IngredientsController(ICrudService<Ingredient> crudIngredients)
        {
            _crudIngredients = crudIngredients;
        }

        [HttpGet("getIngredients")]
        public IngredientView[] GetIngredients([FromServices] ICrudService<Measure> _crudMeasure)
        {
            var ingredients = _crudIngredients.Read();
            var measures = _crudMeasure.Read();
            var result = ingredients.GroupJoin(measures,
                    i => i.MeasureId,
                    m => m.Id,
                    (i, m) => new { i, m })
                .SelectMany(x => x.m.DefaultIfEmpty(),
                    (ing, mea) => new IngredientView
                    {
                        Price = ing.i.Price, 
                        Id = ing.i.Id, 
                        MeasureId = mea.Id, 
                        MeasureName = mea.MeasureName,
                        MeasureSymbol = mea.MeasureSymbol, 
                        Name = ing.i.IngredientName
                    });
            return result.ToArray();
        }
        
        [HttpPost("addIngredients")]
        public IActionResult CreateIngredients([FromBody] IngredientView newIngredient)
        {
            _crudIngredients.Create((Ingredient)newIngredient);
            return Ok();
        }
        
        [HttpPut("updateIngredient")]
        public IActionResult UpdateIngredients([FromBody] IngredientView existIngredient)
        {
            _crudIngredients.Update((Ingredient)existIngredient);
            return Ok();
        }

        [HttpDelete("deleteIngredient")]
        public IActionResult DeleteIngrediets([FromBody] IngredientView ingredient)
        {
            _crudIngredients.Delete((Ingredient)ingredient);
            return Ok();
        }
    }
}