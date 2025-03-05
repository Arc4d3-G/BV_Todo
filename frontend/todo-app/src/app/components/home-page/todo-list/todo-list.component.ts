import { NotificationService } from './../../../services/notification.service';
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    MatProgressSpinner,
  ],
})
export class TodoListComponent implements OnInit {
  loading: boolean = false;
  todos: TodoItem[] = [];
  newTodoTitle: string = '';

  constructor(
    private todoService: TodoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.todoService.getTodos().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.handleError(err);
      },
    });

    this.todoService.todos$.subscribe((todos) => {
      this.todos = todos;
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;
    const newTodo: NewTodoItem = {
      title: this.newTodoTitle,
      isComplete: false,
    };
    this.newTodoTitle = '';
    this.todoService.createTodo(newTodo).subscribe({
      error: (err) => this.handleError(err),
    });
  }

  toggleComplete(todo: TodoItem) {
    const updatedTodo = { ...todo, isComplete: !todo.isComplete };
    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: () => (todo.isComplete = updatedTodo.isComplete),
      error: (err) => this.handleError(err),
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {},
      error: (err) => this.handleError(err),
    });
  }

  get pendingTodos(): TodoItem[] {
    return this.todos.filter((todo) => !todo.isComplete);
  }

  get completedTodos(): TodoItem[] {
    return this.todos.filter((todo) => todo.isComplete);
  }

  handleError(err: Error) {
    console.error(err);
    this.notificationService.showError(err.message);
  }
}
