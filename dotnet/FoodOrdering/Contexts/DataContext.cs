using Microsoft.EntityFrameworkCore;
using FoodOrdering.Models;

namespace FoodOrdering.Contexts;

public class DataContext : DbContext
{
  public DbSet<FoodItem> FoodItems { get; set; }
  public DbSet<Order> Orders { get; set; }

  private readonly string _dbPath;

  public DataContext()
  {
    var folder = Environment.SpecialFolder.LocalApplicationData;
    var path = Environment.GetFolderPath(folder);
    _dbPath = System.IO.Path.Join(path, "foodOrdering.db");
  }

  protected override void OnConfiguring(DbContextOptionsBuilder options)
    => options.UseSqlite($"Data Source={_dbPath}");
}
