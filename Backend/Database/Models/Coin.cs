using System.ComponentModel.DataAnnotations;
namespace VendingMachine.Models
{
    public class Coin
    {
        public int Id { get; set; }
        [Required]
        public int Denomination { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public bool IsBlocked { get; set; } = false;
    }
}