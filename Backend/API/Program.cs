using Database;
using Database.Interface;
using Database.Repository;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Services.Interfaces;
using Services.Services;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins"; // Имя политики

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // Укажите адрес вашего React-приложения
                          policy.WithOrigins("http://localhost:3000")
                                .AllowAnyHeader() // Разрешить любые заголовки
                                .AllowAnyMethod(); // Разрешить любые HTTP-методы (GET, POST, PUT, DELETE и т.д.)
                          // Для большей безопасности можно указать конкретные методы:
                          // .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                          // В production вместо WithOrigins("http://localhost:3000") укажите реальный домен фронтенда
                          // Возможно, понадобится .AllowCredentials() если используете куки/аутентификацию на основе сессий
                      });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<ICoinRepository, CoinRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICoinService, CoinService>();
builder.Services.AddScoped<IOrderService, OrderService>();

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.MapControllers();

app.Run();
