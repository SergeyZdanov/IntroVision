using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Database.Models;

namespace Services.Interfaces
{
    public interface IBrandService
    {
        Task<IEnumerable<Brand>> GetBrandsAsync();
    }
}
