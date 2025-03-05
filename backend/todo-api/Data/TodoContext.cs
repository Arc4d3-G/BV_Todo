using Microsoft.EntityFrameworkCore;
using todo_api.Models;

namespace todo_api.Data;

public class TodoContext(DbContextOptions<TodoContext> options) : DbContext(options)
{
   public DbSet<TodoItem> TodoItems { get; set; }
   public DbSet<User> Users { get; set; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.Entity<User>()
         .HasMany(u => u.Todos)
         .WithOne(t => t.User)
         .HasForeignKey(t => t.UserId);
   }
}