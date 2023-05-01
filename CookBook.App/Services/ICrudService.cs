using System;
using System.Collections.Generic;
using CookBook.App.Models.Interfaces;

namespace CookBook.App
{
    public interface ICrudService<T>
    {
        int Create(T entry);
        IEnumerable<T> Read();
        void Update(T updatedEntry);
        void Delete(T entry);
    }
}