create or alter procedure dbo.OrdersReport
(
    @StartDate date,
    @EndDate date
)
as
begin
    ;with IngredientSpent as
    (select IngredientId,
            SUM(oi.CountOf * ri.CountOf)           "InIngredients",
            SUM(oi.CountOf * ri.CountOf * I.Price) "InMoney"
         from Orders
                  inner join OrderItems oi on Orders.Id = OI.OrderId
                  inner join Recipes recipes on recipes.Id = OI.RecipeId
                  inner join RecipesIngredients ri on recipes.Id = ri.RecipeId
                  inner join Ingredients I on I.Id = ri.IngredientId
         where OrderDate BETWEEN @StartDate AND @EndDate
         group by IngredientId
    ),
    WithMeasures as
    (
        select IngredientName, InIngredients, MeasureSymbol, InMoney from IngredientSpent ISpent
        inner join Ingredients Ing on ISpent.IngredientId = Ing.Id
        inner join Measures mea on Ing.MeasureId = mea.id
    )
    select * from WithMeasures

    ;with RecipesOrdered as
    (
        select RecipeId, COUNT(RecipeId) as CountOf
            from Orders
            inner join OrderItems OI on Orders.Id = OI.OrderId
            inner join Recipes R2 on OI.RecipeId = R2.Id
        where OrderDate BETWEEN @StartDate AND @EndDate
        group by RecipeId
    )
    select RecipeName, CountOf from RecipesOrdered recOrdered
    inner join Recipes rec on rec.Id = recOrdered.RecipeId
end
go