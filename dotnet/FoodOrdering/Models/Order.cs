using System;
using System.Text.Json.Serialization;

namespace FoodOrdering.Models;

public class Order
{
  public int ID { get; set; }
  public int TableNumber { get; set; }
  public int FoodItemId { get; set; }
  public FoodItem FoodItem { get; set; }
  public DateTimeOffset OrderDate { get; set; }
  public OrderState OrderState { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum OrderState
{
  Ordered,
  Preparing,
  AwaitingDelivery,
  Completed
}
