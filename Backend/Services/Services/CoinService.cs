using Database.Repository;
using Database.Interface;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class CoinService : ICoinService
    {
        private readonly ICoinRepository _coinRepository;

        public CoinService(ICoinRepository coinRepository)
        {
            _coinRepository = coinRepository;
        }

        public async Task<Dictionary<int, int>> GetCoinStockAsync()
        {
            var coins = await _coinRepository.GetAllAsync();
            return coins.ToDictionary(c => c.Denomination, c => c.Quantity);
        }

        public async Task<(bool Possible, Dictionary<int, int> ChangeBreakdown)> TryGetChangeBreakdownAsync(decimal changeAmount)
        {
            if (changeAmount < 0) return (false, null);
            if (changeAmount == 0) return (true, new Dictionary<int, int>());

            int changeInKopecks = (int)(changeAmount * 100);
            if ((decimal)changeInKopecks / 100 != changeAmount)
            {
                return (false, null);
            }


            var availableCoins = (await _coinRepository.GetAllAsync())
                                    .Where(c => !c.IsBlocked && c.Quantity > 0)
                                    .OrderByDescending(c => c.Denomination)
                                    .ToList();

            var changeBreakdown = new Dictionary<int, int>();
            var tempCoinStock = availableCoins.ToDictionary(c => c.Denomination, c => c.Quantity);

            foreach (var coin in availableCoins)
            {
                int denominationInKopecks = coin.Denomination * 100;
                if (changeInKopecks == 0) break;
                if (denominationInKopecks == 0) continue;

                if (changeInKopecks >= denominationInKopecks)
                {
                    int countNeeded = changeInKopecks / denominationInKopecks;
                    int countAvailable = tempCoinStock[coin.Denomination];
                    int countToUse = Math.Min(countNeeded, countAvailable);

                    if (countToUse > 0)
                    {
                        changeBreakdown[coin.Denomination] = countToUse;
                        tempCoinStock[coin.Denomination] -= countToUse;
                        changeInKopecks -= countToUse * denominationInKopecks;
                    }
                }
            }

            if (changeInKopecks == 0)
            {
                return (true, changeBreakdown);
            }
            else
            {
                return (false, null);
            }
        }
    }
}
