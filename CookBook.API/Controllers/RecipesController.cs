using System.Linq;
using CookBook.API.Dto;
using CookBook.App;
using CookBook.App.Models;
using CookBook.App.Models.Interfaces;
using Microsoft.AspNetCore.Cors;
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
            var result = recipes.Join(
                recIng,
                r => r.Id,
                ri => ri.RecipeId,
                (r, ri) => new { Recipe = r, RecIng = ri }
            ).Join(ingredientViews,
                rri => rri.RecIng.IngredientId,
                i => i.Id,
                (rri, i) => new { rri, IngView = i, rri.RecIng.CountOf, rri.RecIng.Id }
            ).GroupBy(
                r => new { r.rri.Recipe.Id, r.rri.Recipe.RecipeName, r.rri.Recipe.RecipeComment },
                (key, g) =>
                    new RecipeView
                    {
                        Id = key.Id,
                        RecipeName = key.RecipeName,
                        RecipeComment = key.RecipeComment,
                        Ingredients = g.Select(r => new RecipeIngredientView
                            {   Ingredient = r.IngView, 
                                CountOf = r.CountOf, 
                                RecipeIngredientId = r.Id }).ToArray()
                    }
            );
            return result.ToArray();
        }
    }
}