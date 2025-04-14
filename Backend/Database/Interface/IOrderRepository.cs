using Database.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Database.Interface
{
    public interface IOrderRepository
    {
        Task AddAsync(Order order);
    }
}
