namespace API.Dto
{
    public class CreateOrderRequestDto
    {
        public List<OrderItemRequestDto> Items { get; set; } = new List<OrderItemRequestDto>();
        public Dictionary<int, int> CoinsPaid { get; set; } = new Dictionary<int, int>();
    }
}
