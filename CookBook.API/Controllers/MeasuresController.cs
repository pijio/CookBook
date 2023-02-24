using System.Linq;
using System.Threading.Tasks;
using CookBook.App;
using CookBook.App.Models;
using CookBook.App.Models.Interfaces;
using CookBook.App.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CookBook.API.Controllers
{
    [EnableCors("ApiPolicy")]
    [Route("/api/measures")]
    [ApiController]
    public class MeasuresController : Controller
    {
        private readonly ICrudService<Measure> _crudIngredients;

        public MeasuresController(ICrudService<Measure> crudIngredients)
        {
            _crudIngredients = crudIngredients;
        }

        [HttpGet("getMeasures")]
        public Measure[] GetIngredients()
        {
            return _crudIngredients.Read().ToArray();
        }
        
        [HttpPost("addMeasures")]
        public IActionResult CreateIngredients([FromBody] Measure newMeasure)
        {
            _crudIngredients.Create(newMeasure);
            return Ok();
        }
        
        [HttpPut("updateMeasures")]
        public IActionResult UpdateIngredients([FromBody] Measure existMeasure)
        {
            _crudIngredients.Update(existMeasure);
            return Ok();
        }

        [HttpDelete("deleteMeasures")]
        public IActionResult DeleteIngrediets([FromBody] Measure measure)
        {
            _crudIngredients.Delete(measure);
            return Ok();
        }
    }
}