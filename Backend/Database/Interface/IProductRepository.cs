using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database.Interface
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllWithBrandAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product?> GetByIdWithTrackingAsync(int id); // Нужен для обновления
        void Update(Product product);
    }
}
