CREATE TABLE dbo.RecipesIngredients (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    RecipeId INT NOT NULL,
    IngredientId INT NOT NULL,
    CountOf DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_RecipesIngredients_Recipes FOREIGN KEY (RecipeId) REFERENCES dbo.Recipes(Id),
    CONSTRAINT FK_RecipesIngredients_Ingredients FOREIGN KEY (IngredientId) REFERENCES dbo.Ingredients(Id)
);