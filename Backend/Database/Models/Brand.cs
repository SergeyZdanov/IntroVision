using System.ComponentModel.DataAnnotations;
namespace Database.Models
{
    public class Brand
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public virtual ICollection<Product> Products { get; set; }
        public Brand()
        {
            Products = new List<Product>();
        }
    }
}