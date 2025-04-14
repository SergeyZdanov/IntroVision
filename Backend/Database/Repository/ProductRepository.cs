using Database.Interface;
using Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly DatabaseContext _context;

        public ProductRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllWithBrandAsync()
        {
            return await _context.Products
                                 .Include(p => p.Brand)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                                .AsNoTracking()
                                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product?> GetByIdWithTrackingAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public void Update(Product product)
        {
            _context.Products.Update(product);
        }
    }
}
