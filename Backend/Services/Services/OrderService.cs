using Database.Interface;
using Database.Models;
using Database.Repository;
using Database;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class OrderService : IOrderService
    {
        private readonly DatabaseContext _context; // Нужен для транзакций и SaveChanges
        private readonly IProductRepository _productRepository;
        private readonly ICoinRepository _coinRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly ICoinService _coinService; // Для расчета сдачи

        public OrderService(
        DatabaseContext context,
            IProductRepository productRepository,
            ICoinRepository coinRepository,
            IOrderRepository orderRepository,
            ICoinService coinService)
        {
            _context = context;
            _productRepository = productRepository;
            _coinRepository = coinRepository;
            _orderRepository = orderRepository;
            _coinService = coinService;
        }

        public async Task<ProcessOrderResult> ProcessOrderAsync(
            Dictionary<int, int> itemsToOrder,
            Dictionary<int, int> coinsPaid)
        {
            var result = new ProcessOrderResult { Success = false };

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                decimal orderTotal = 0;
                var orderItemsToAdd = new List<OrderItem>();
                var productsToUpdate = new Dictionary<int, Product>();

                foreach (var item in itemsToOrder)
                {
                    int productId = item.Key;
                    int quantity = item.Value;

                    // Получаем товар с отслеживанием для обновления
                    var product = await _productRepository.GetByIdWithTrackingAsync(productId);

                    if (product == null)
                    {
                        result.ErrorMessage = $"Товар с ID {productId} не найден.";
                        await transaction.RollbackAsync();
                        return result;
                    }
                    if (product.Quantity < quantity)
                    {
                        result.ErrorMessage = $"Недостаточно товара '{product.Name}'. Остаток: {product.Quantity}.";
                        await transaction.RollbackAsync();
                        return result;
                    }

                    var brand = await _context.Brands.FindAsync(product.BrandId);

                    product.Quantity -= quantity;
                    productsToUpdate[productId] = product;

                    decimal itemPrice = product.Price;
                    orderTotal += itemPrice * quantity;
                    orderItemsToAdd.Add(new OrderItem
                    {
                        ProductId = product.Id,
                        ProductName = product.Name,
                        BrandName = brand?.Name ?? "Unknown",
                        PricePerItem = itemPrice,
                        Quantity = quantity
                    });
                }

                decimal amountPaid = coinsPaid.Sum(c => (decimal)c.Key * c.Value);

                if (amountPaid < orderTotal)
                {
                    result.ErrorMessage = $"Недостаточно средств. Внесено: {amountPaid}, требуется: {orderTotal}.";
                    await transaction.RollbackAsync();
                    return result;
                }

                decimal changeNeeded = amountPaid - orderTotal;
                Dictionary<int, int> changeBreakdown = null;
                var coinsToUpdate = (await _coinRepository.GetAllAsync()).ToDictionary(c => c.Denomination);

                if (changeNeeded > 0)
                {
                    var changeResult = await _coinService.TryGetChangeBreakdownAsync(changeNeeded);
                    if (!changeResult.Possible)
                    {
                        result.ErrorMessage = "Извините, автомат не может выдать сдачу.";
                        await transaction.RollbackAsync();
                        return result;
                    }
                    changeBreakdown = changeResult.ChangeBreakdown;

                    foreach (var changeCoin in changeBreakdown)
                    {
                        if (coinsToUpdate.TryGetValue(changeCoin.Key, out var coinInDb))
                        {
                            coinInDb.Quantity -= changeCoin.Value;
                        }

                        if (coinInDb.Quantity < 0) throw new InvalidOperationException("Coin stock calculation error.");
                    }
                }

                foreach (var paidCoin in coinsPaid)
                {
                    if (coinsToUpdate.TryGetValue(paidCoin.Key, out var coinInDb))
                    {
                        coinInDb.Quantity += paidCoin.Value;
                    }
                    else
                    {

                    }
                }

                _coinRepository.UpdateRange(coinsToUpdate.Values);

                foreach (var prod in productsToUpdate.Values)
                {
                    _productRepository.Update(prod);
                }


                var newOrder = new Order
                {
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = orderTotal,
                    OrderItems = orderItemsToAdd
                };
                await _orderRepository.AddAsync(newOrder);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                result.Success = true;
                result.ChangeAmount = changeNeeded;
                result.ChangeCoins = changeBreakdown ?? new Dictionary<int, int>();
                return result;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                Console.WriteLine($"Error processing order: {ex.Message}");
                result.ErrorMessage = "Произошла внутренняя ошибка при обработке заказа.";
                return result;
            }
        }
    }
}
