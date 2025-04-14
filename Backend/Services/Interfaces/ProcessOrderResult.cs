using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public class ProcessOrderResult
    {
        public bool Success { get; set; }
        public decimal ChangeAmount { get; set; }
        public Dictionary<int, int> ChangeCoins { get; set; } = new Dictionary<int, int>();
        public string? ErrorMessage { get; set; }
    }

    public interface IOrderService
    {
        Task<ProcessOrderResult> ProcessOrderAsync(
            Dictionary<int, int> itemsToOrder,
            Dictionary<int, int> coinsPaid
        );
    }
}
