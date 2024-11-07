using Microsoft.EntityFrameworkCore;
using FoodOrdering.Models;

namespace FoodOrdering.Contexts;

public class DataContext : DbContext
{
  public DbSet<FoodItem> FoodItems { get; set; }
  public DbSet<Order> Orders { get; set; }

  private readonly string _dbPath;

  public DataContext(DbContextOptions<DataContext> options) : base(options)
  {
  }
}
