create or alter procedure dbo.RecipesReport
(
    @Portions INT
)
AS
    BEGIN
        SET @Portions = ISNULL(@Portions, 1)
        select R.RecipeName,
               IngredientName,
               CountOf*@Portions 'TotalCount',
               MeasureName,
               MeasureSymbol,
               Price*RI.CountOf*@Portions 'TotalPrice'
        from Recipes R
        left join RecipesIngredients RI on R.Id = RI.RecipeId
        left join Ingredients I on RI.IngredientId = I.ID
        left join Measures M on I.MeasureId = M.Id
    END
go