using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ICoinService
    {
        Task<Dictionary<int, int>> GetCoinStockAsync();
        Task<(bool Possible, Dictionary<int, int> ChangeBreakdown)> TryGetChangeBreakdownAsync(decimal changeAmount);
    }
}
