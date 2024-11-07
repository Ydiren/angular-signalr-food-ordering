using FoodOrdering.Contexts;
using FoodOrdering.Hubs;
using FoodOrdering.Models;
using FoodOrdering.Workers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Data Source=food.db"));
builder.Services.AddHostedService<SeedingWorker>();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/fooditems", async ([FromServices] DataContext context) => await context.FoodItems.ToListAsync());
app.MapGet("/kitchen", async ([FromServices] DataContext context) =>
{
  var orders = context.Orders
    .Include(x => x.FoodItem)
    .Where(x => x.OrderState != OrderState.Completed);
  return await orders.ToListAsync();
});

app.MapHub<FoodHub>("/foodhub");

app.Run();

