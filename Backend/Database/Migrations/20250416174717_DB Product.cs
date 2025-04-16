using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class DBProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "BrandId", "ImageUrl", "Name", "Price", "Quantity" },
                values: new object[,]
                {
                    { 1, 1, "/images/cola.png", "Напиток газированный Coca-Cola", 105m, 10 },
                    { 2, 2, "/images/fanta.png", "Напиток газированный Fanta", 98m, 5 },
                    { 3, 3, "/images/sprite.png", "Напиток газированный Sprite", 83m, 8 },
                    { 4, 4, "/images/dr_pepper.png", "Напиток газированный Dr. Pepper Zero", 110m, 0 },
                    { 5, 5, "/images/pepsi.png", "Напиток газированный Pepsi", 95m, 12 },
                    { 6, 6, "/images/7up.png", "Напиток газированный 7UP", 85m, 7 },
                    { 7, 7, "/images/mirinda.png", "Напиток газированный Mirinda", 92m, 3 },
                    { 8, 8, "/images/dew.png", "Напиток газированный Mountain Dew", 100m, 6 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
