using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace VendingMachine.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        [Required]
        public int OrderId { get; set; }
        public virtual Order Order { get; set; }
        public int? ProductId { get; set; }
        public virtual Product? Product { get; set; }
        [Required]
        [MaxLength(150)]
        public string ProductName { get; set; }
        [Required]
        [MaxLength(100)]
        public string BrandName { get; set; }
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal PricePerItem { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}