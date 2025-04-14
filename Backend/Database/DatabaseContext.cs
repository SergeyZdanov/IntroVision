using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VendingMachine.Models;

namespace Database
{
    public class DatabaseContext : IdentityDbContext
    {
        public DatabaseContext()
        {
        }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Coin> Coins { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItem { get; set; }
        public DbSet<Product> Products { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Brand>().HasData(
                new Brand { Id = 1, Name = "Coca-Cola" },
                new Brand { Id = 2, Name = "Fanta" },
                new Brand { Id = 3, Name = "Sprite" },
                new Brand { Id = 4, Name = "Dr. Pepper" },
                new Brand { Id = 5, Name = "Pepsi" },
                new Brand { Id = 6, Name = "7UP" },
                new Brand { Id = 7, Name = "Mirinda" },
                new Brand { Id = 8, Name = "Mountain Dew" }
            );

            modelBuilder.Entity<Coin>().HasData(
                new Coin { Id = 1, Denomination = 1, Quantity = 100, IsBlocked = false },
                new Coin { Id = 2, Denomination = 2, Quantity = 100, IsBlocked = false },
                new Coin { Id = 3, Denomination = 5, Quantity = 100, IsBlocked = false },
                new Coin { Id = 4, Denomination = 10, Quantity = 100, IsBlocked = false }
            );
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = "Host=localhost;Port=5432;Database=InvintroDB;Username=postgres;Password=111";
            optionsBuilder.UseNpgsql(connectionString);
        }
    }
}
