using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using todo_api.Data;
using todo_api.Models;

namespace todo_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoController : ControllerBase
{
   private readonly TodoContext _context;

   public TodoController(TodoContext context)
   {
      _context = context;
      
   }

   // Get User Todos
   [HttpGet("{userId}")]
   public async Task<ActionResult<IEnumerable<TodoItem>>> GetUserTodos(int userId)
   {
       return await _context.TodoItems.Where(t => t.UserId == userId).ToListAsync();
   }
   
   // Post Create new todoItem
   [HttpPost()]
   public async Task<ActionResult<TodoItem>> CreateTodoItem(TodoItem todo)
   {
       var user = await _context.Users.FindAsync(todo.UserId);
       if (user == null)
       {
           return BadRequest("User not found");
       }

       _context.TodoItems.Add(todo);
       await _context.SaveChangesAsync();

       return CreatedAtAction(nameof(GetUserTodos), new { userId = todo.UserId }, todo);
   }
   
   // Update todoItem
   [HttpPut("{id}")]
   public async Task<IActionResult> UpdateTodoItem(int id, TodoItem updatedTodo)
   {
       var existingTodo = await _context.TodoItems.FindAsync(id);
   
       if (existingTodo == null)
       {
           return NotFound("Todo not found");
       }
   
       if (existingTodo.UserId != updatedTodo.UserId)
       {
           return Unauthorized("Todo does not belong to user");
       }

       existingTodo.Title = updatedTodo.Title;
       existingTodo.IsComplete = updatedTodo.IsComplete;
       
       await _context.SaveChangesAsync();
       return NoContent();
   }

   // Delete todoItem
   [HttpDelete("{id}")]
   public async Task<IActionResult> DeleteTodoItem(int id, int userId)
   {
       var todo = await _context.TodoItems.FindAsync(id);

       if (todo == null)
       {
           return NotFound();
       }

       if (todo.UserId != userId)
       {
           return Unauthorized();
       }

       _context.TodoItems.Remove(todo);
       await _context.SaveChangesAsync();
       
       return NoContent();
   }
}