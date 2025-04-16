using Microsoft.EntityFrameworkCore;
using Database.Models;

namespace Database
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
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

            modelBuilder.Entity<Product>().HasData(
    new Product { Id = 1, Name = "Напиток газированный Coca-Cola", BrandId = 1, Price = 105m, Quantity = 10, ImageUrl = "/images/cola.jpg" },
    new Product { Id = 2, Name = "Напиток газированный Fanta", BrandId = 2, Price = 98m, Quantity = 5, ImageUrl = "/images/fanta.jpg" },
    new Product { Id = 3, Name = "Напиток газированный Sprite", BrandId = 3, Price = 83m, Quantity = 8, ImageUrl = "/images/sprite.jpg" },
    new Product { Id = 4, Name = "Напиток газированный Dr. Pepper Zero", BrandId = 4, Price = 110m, Quantity = 0, ImageUrl = "/images/dr_pepper.jpg" },
    new Product { Id = 5, Name = "Напиток газированный Pepsi", BrandId = 5, Price = 95m, Quantity = 12, ImageUrl = "/images/pepsi.jpg" },
    new Product { Id = 6, Name = "Напиток газированный 7UP", BrandId = 6, Price = 85m, Quantity = 7, ImageUrl = "/images/7up.jpg" },
    new Product { Id = 7, Name = "Напиток газированный Mirinda", BrandId = 7, Price = 92m, Quantity = 3, ImageUrl = "/images/mirinda.jpg" },
    new Product { Id = 8, Name = "Напиток газированный Mountain Dew", BrandId = 8, Price = 100m, Quantity = 6, ImageUrl = "/images/dew.jpg" }
            );
        }

       /* protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            *//*string connectionString = "Host=localhost;Port=5432;Database=InvintroDB;Username=postgres;Password=111";*//*

            string connectionString = "Host=localhost;Port=5050;Database=InvintroDB;Username=postgres;Password=pg_pass";
            optionsBuilder.UseNpgsql(connectionString);
        }*/
    }
}
