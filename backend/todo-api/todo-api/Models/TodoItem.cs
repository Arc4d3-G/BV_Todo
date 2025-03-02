using System.Text.Json.Serialization;

namespace todo_api.Models;

public class TodoItem
{
   public int Id { get; set; }
   public int UserId { get; set; }
   public string Title { get; set; } 
   public bool IsComplete { get; set; }
   [JsonIgnore]
   public User User { get; set; } 
}