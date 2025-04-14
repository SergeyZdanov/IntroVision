using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database.Interface
{
    public interface ICoinRepository
    {
        Task<IEnumerable<Coin>> GetAllAsync();
        void UpdateRange(IEnumerable<Coin> coins);
    }
}
