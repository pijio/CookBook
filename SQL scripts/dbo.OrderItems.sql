CREATE TABLE dbo.OrderItems (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    OrderId INT NOT NULL,
    RecipeId INT NOT NULL,
    CountOf INT NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES dbo.Orders (Id),
    FOREIGN KEY (RecipeId) REFERENCES dbo.Recipes (Id)
);