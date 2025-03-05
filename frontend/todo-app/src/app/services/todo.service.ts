import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NewTodoItem, TodoItem } from '../models/todo-item';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = environment.apiUrl + '/todo';

  private todosSubject = new BehaviorSubject<TodoItem[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Expose the current todos state as an observable
  get todos$(): Observable<TodoItem[]> {
    return this.todosSubject.asObservable();
  }

  // Get user todos
  getTodos(): Observable<TodoItem[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TodoItem[]>(`${this.apiUrl}/me`, { headers }).pipe(
      // Update the todoSubject with the fetched todos
      tap((todos) => {
        this.todosSubject.next(todos.sort((a, b) => a.id - b.id));
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // Create new todo item
  createTodo(todo: NewTodoItem): Observable<TodoItem> {
    const headers = this.getAuthHeaders();

    // Optimistically add todo
    const currentTodos = [...this.todosSubject.value];
    const optimisticTodo: TodoItem = { ...todo, id: 0 }; // Temporary ID
    this.todosSubject.next([...currentTodos, optimisticTodo]);

    return this.http.post<TodoItem>(this.apiUrl, todo, { headers }).pipe(
      // On success, update the temporary todo with the real ID
      tap((createdTodo) => {
        const updatedTodos = this.todosSubject.value.map((t) =>
          t.id === optimisticTodo.id
            ? { ...createdTodo, id: createdTodo.id }
            : t
        );
        this.todosSubject.next(updatedTodos);
      }),
      catchError((error) => {
        // Revert on failure
        this.todosSubject.next(currentTodos);
        return this.handleError(error);
      })
    );
  }

  // Update existing todo item
  updateTodo(id: number, todo: TodoItem): Observable<any> {
    const headers = this.getAuthHeaders();
    const currentTodos = [...this.todosSubject.value];
    const index = currentTodos.findIndex((t) => t.id === id);
    if (index === -1) return throwError(() => new Error('Todo not found'));

    // Optimistically update
    const updatedTodos = [...currentTodos];
    updatedTodos[index] = { ...updatedTodos[index], ...todo };
    this.todosSubject.next(updatedTodos);

    return this.http.put(`${this.apiUrl}/${id}`, todo, { headers }).pipe(
      catchError((error) => {
        // Revert on failure
        this.todosSubject.next(currentTodos);
        return this.handleError(error);
      })
    );
  }

  // Delete todo item
  deleteTodo(id: number): Observable<any> {
    const headers = this.getAuthHeaders();

    // Optimistically update
    const currentTodos = [...this.todosSubject.value];
    const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
    this.todosSubject.next(updatedTodos);

    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        // Revert on failure
        this.todosSubject.next(currentTodos);
        return this.handleError(error);
      })
    );
  }

  // Get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMessage =
        'A network error occurred. Please check your internet connection and try again.';
    } else {
      switch (error.status) {
        case 400:
          errorMessage =
            'Bad request. Please check the data you entered and try again.';
          break;
        case 401:
          errorMessage = 'Session expired. Please log in again.';
          this.authService.logout();
          break;
        case 403:
          errorMessage =
            'Access denied. You do not have the necessary permissions.';
          break;
        case 404:
          errorMessage =
            'Resource not found. Please check the URL and try again.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
      }
    }
    return throwError(() => new Error(errorMessage, { cause: error.status }));
  }
}
