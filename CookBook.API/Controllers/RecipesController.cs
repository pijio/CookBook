using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CookBook.API.Dto;
using CookBook.App;
using CookBook.App.Models;
using CookBook.App.Models.Interfaces;
using CookBook.App.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CookBook.API.Controllers
{
    [EnableCors("ApiPolicy")]
    [Route("/api/recipes")]
    [ApiController]
    public class RecipesController : Controller
    {
        private readonly ICrudService<Recipe> _recipeCrud;
        private readonly ICrudService<RecipeIngredient> _recIngCrud;
        public RecipesController(ICrudService<Recipe> recipeCrud, ICrudService<RecipeIngredient> recIngCrud)
        {
            _recipeCrud = recipeCrud;
            _recIngCrud = recIngCrud;
        }
        
        [HttpGet("getRecipes")]
        public RecipeView[] GetRecipes([FromServices] ICrudService<Ingredient> _crudIngredients, [FromServices] ICrudService<Measure> _crudMeasure)
        {
            var ingredients = _crudIngredients.Read();
            var measures = _crudMeasure.Read();
            var ingredientViews = ingredients.GroupJoin(measures,
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
            var recipes = _recipeCrud.Read();
            var recIng = _recIngCrud.Read();
            var result = from r in recipes
                join ri in recIng on r.Id equals ri.RecipeId into riGroup
                from ri in riGroup.DefaultIfEmpty()
                join i in ingredientViews on ri?.IngredientId equals i.Id into iGroup
                from i in iGroup.DefaultIfEmpty()
                group new { ri, i } by new { r.Id, r.RecipeName, r.RecipeComment } into g
                select new RecipeView
                {
                    Id = g.Key.Id,
                    RecipeName = g.Key.RecipeName,
                    RecipeComment = g.Key.RecipeComment,
                    Ingredients = g.Where(x => x.i != null)
                        .Select(x => new RecipeIngredientView
                        {
                            Ingredient = x.i,
                            CountOf = x.ri?.CountOf ?? 0,
                            RecipeIngredientId = x.ri?.Id ?? 0
                        })
                        .ToArray()
                };
            return result.ToArray();
        }

        [HttpPost("deleteRecipeIngredient")]
        public IActionResult DeleteRecipeIngredient([FromBody] RecipeIngredient recipeIngredient)
        {
            _recIngCrud.Delete(recipeIngredient);
            return Ok();
        }
        
        [HttpPost("deleteRecipe")]
        public IActionResult DeleteRecipe([FromBody] Recipe recipe)
        {
            _recipeCrud.Delete(recipe);
            return Ok();
        }

        [HttpPost("addRecipeIngredient")]
        public IActionResult AddRecipeIngredient([FromBody] RecipeIngredient recipeIngredient)
        {
            _recIngCrud.Create(recipeIngredient);
            return Ok();
        }
        
        [HttpPost("getRecipeIngredientId")]
        public int GetRecipeIngredientId([FromBody] RecipeIngredient recipeIngredient)
        {
            var result = _recIngCrud.Read().FirstOrDefault(x =>
                x.IngredientId == recipeIngredient.IngredientId && x.RecipeId == recipeIngredient.RecipeId);
            if (result == null)
                throw new BadHttpRequestException("Ингридиент рецепта не найден!");
            return result.Id;
        }
        
        [HttpPost("addRecipe")]
        public IActionResult AddRecipe([FromBody] Recipe recipe)
        {
            _recipeCrud.Create(recipe);
            return Ok();
        }
        
        [HttpPost("getRecipeId")]
        public int GetRecipeIngredientId([FromBody] Recipe recipe)
        {
            var result = _recipeCrud.Read().FirstOrDefault(x =>
                x.RecipeName == recipe.RecipeName);
            if (result == null)
                throw new BadHttpRequestException("Рецепт не найден!");
            return result.Id;
        }

        [HttpPost("getReport")]
        public IActionResult GetReport(int portions, [FromServices] IReportService reportService)
        {
            var stream = reportService.GetRecipesReport(portions);
            var result = new FileStreamResult(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            return result;
        } 
    }
}