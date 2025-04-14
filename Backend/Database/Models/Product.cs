using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Database.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }
        [Required]
        public int Quantity { get; set; }
        [MaxLength(255)]
        public string? ImageUrl { get; set; }
        [Required]
        public int BrandId { get; set; }
        public virtual Brand Brand { get; set; }
    }
}