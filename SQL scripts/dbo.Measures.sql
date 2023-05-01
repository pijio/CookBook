CREATE TABLE dbo.Measures (
    Id INT IDENTITY (1, 1),
    MeasureName NVARCHAR(100) NOT NULL,
    MeasureSymbol NVARCHAR(5) NOT NULL
    PRIMARY KEY (Id)
)
GO