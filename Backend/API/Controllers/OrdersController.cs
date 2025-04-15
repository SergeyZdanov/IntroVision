using API.Dto;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Маршрут /api/orders
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<ProcessOrderResult>> CreateOrder([FromBody] CreateOrderRequestDto request)
        {
            if (request == null || request.Items == null || !request.Items.Any())
            {
                return BadRequest(new ProcessOrderResult { ErrorMessage = "Заказ не содержит товаров." });
            }

            if (request.CoinsPaid == null)
            {
                return BadRequest(new ProcessOrderResult { ErrorMessage = "Информация об оплате отсутствует." });
            }

            var itemsDictionary = request.Items.ToDictionary(item => item.ProductId, item => item.Quantity);

            var result = await _orderService.ProcessOrderAsync(itemsDictionary, request.CoinsPaid);

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
    }
}
