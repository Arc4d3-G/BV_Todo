using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using todo_api.Data;
using todo_api.DTO;
using todo_api.Models;

namespace todo_api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TodoController : ControllerBase
{
    private readonly TodoContext _context;

    public TodoController(TodoContext context)
    {
        _context = context;
    }

    // Get User Todos
    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetUserTodos()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var todos = await _context.TodoItems.Where(t => t.UserId == userId).Select(t => new TodoItemDTO
        {
            Title = t.Title,
            IsComplete = t.IsComplete,
            Id = t.Id
        }).ToListAsync();

        if (todos == null || !todos.Any())
        {
            return NotFound("No todos found.");
        }

        return Ok(todos);
    }

    // Post Create new todoItem
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodoItem(TodoItemDTO todoDto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return BadRequest("User not found");
        }

        var todo = new TodoItem
        {
            Title = todoDto.Title,
            IsComplete = todoDto.IsComplete,
            UserId = userId,
            User = user
        };

        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserTodos), new { userId = todo.UserId }, todo);
    }

    // Update todoItem
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodoItem(int id, TodoItemDTO updatedTodoDto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var existingTodo = await _context.TodoItems.FindAsync(id);

        if (existingTodo == null)
        {
            return NotFound("Todo not found");
        }

        if (existingTodo.UserId != userId)
        {
            return Unauthorized("Todo does not belong to the authenticated user");
        }

        existingTodo.Title = updatedTodoDto.Title;
        existingTodo.IsComplete = updatedTodoDto.IsComplete;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Delete todoItem
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var todo = await _context.TodoItems.FindAsync(id);

        if (todo == null)
        {
            return NotFound("Todo not found");
        }

        if (todo.UserId != userId)
        {
            return Unauthorized("Todo does not belong to the authenticated user");
        }

        _context.TodoItems.Remove(todo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}