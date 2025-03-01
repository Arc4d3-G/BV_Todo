namespace todo_api.Models;

public class TodoItem
{
   public int Id { get; set; }
   public int UserId { get; set; }
   public string Title { get; set; } = string.Empty;
   public bool IsComplete { get; set; }
   
   public User User { get; set; } = null!;
}