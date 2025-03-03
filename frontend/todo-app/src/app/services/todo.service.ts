import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NewTodoItem, TodoItem } from '../models/todo-item';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:5014/api/todo';

  constructor(private http: HttpClient) {}

  // Get user todos
  getTodos(): Observable<TodoItem[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<TodoItem[]>(`${this.apiUrl}/me`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Create new todo item
  createTodo(todo: NewTodoItem): Observable<TodoItem> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<TodoItem>(this.apiUrl, todo, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update existing todo item
  updateTodo(id: number, todo: TodoItem): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .put(`${this.apiUrl}/${id}`, todo, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete todo item
  deleteTodo(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
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
          errorMessage = 'Unauthorized. Please log in again.';
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

    return throwError(() => new Error(errorMessage));
  }
}
