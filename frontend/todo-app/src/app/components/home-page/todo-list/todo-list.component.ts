import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoService } from '../../../services/todo.service';
import { NewTodoItem, TodoItem } from '../../../models/todo-item';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
  ],
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  newTodoTitle: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (err) => console.error(err),
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;

    const newTodo: NewTodoItem = {
      title: this.newTodoTitle,
      isComplete: false,
    };

    this.todoService.createTodo(newTodo).subscribe({
      next: (createdTodo) => {
        this.todos.push(createdTodo);
        this.newTodoTitle = '';
      },
      error: (err) => console.error(err),
    });
  }

  toggleComplete(todo: TodoItem) {
    const updatedTodo = { ...todo, isComplete: !todo.isComplete };

    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: () => (todo.isComplete = updatedTodo.isComplete),
      error: (err) => console.error(err),
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => (this.todos = this.todos.filter((t) => t.id !== id)),
      error: (err) => console.error(err),
    });
  }

  // Get filtered lists
  get pendingTodos(): TodoItem[] {
    return this.todos.filter((todo) => !todo.isComplete);
  }

  get completedTodos(): TodoItem[] {
    return this.todos.filter((todo) => todo.isComplete);
  }
}
