using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace todo_api.Migrations
{
    /// <inheritdoc />
    public partial class RenameTaksToTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Task",
                table: "TodoItems",
                newName: "Title");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "TodoItems",
                newName: "Task");
        }
    }
}
