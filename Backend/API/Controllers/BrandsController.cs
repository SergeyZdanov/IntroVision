using API.Dto;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BrandDto>>> GetBrands()
        {
            var brands = await _brandService.GetBrandsAsync();

            var brandDtos = brands.Select(brand => new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name
            });

            return Ok(brandDtos);
        }
    }
}
