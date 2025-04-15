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
    public class CoinRepository : ICoinRepository
    {
        private readonly DatabaseContext _context;

        public CoinRepository(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Coin>> GetAllAsync()
        {
            return await _context.Coins.ToListAsync();
        }

        public void UpdateRange(IEnumerable<Coin> coins)
        {
            _context.Coins.UpdateRange(coins);
        }
    }
}
