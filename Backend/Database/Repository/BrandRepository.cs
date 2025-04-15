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
    public class BrandRepository : IBrandRepository
    {
        private readonly DatabaseContext _context;

        public BrandRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Brand>> GetAllAsync()
        {
            return await _context.Brands.AsNoTracking().ToListAsync();
        }
    }
}
