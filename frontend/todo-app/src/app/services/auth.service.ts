import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5014/api/user'; // Adjust if needed

  constructor(private http: HttpClient) {}

  // Register a new user
  register(email: string, password: string, username: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, { email, password, username })
      .pipe(
        catchError(this.handleError) // Handle errors
      );
  }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Get current authenticated user
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/me`, { headers }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token'); // Remove token from storage
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    console.log({ errorAtHandle: error });
    let errorMessage;

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage =
        'A network error occurred. Please check your internet connection and try again.';
    } else {
      // Backend error
      switch (error.status) {
        case 400:
          errorMessage =
            error.error ||
            'Bad request. Please check the data you entered and try again.';
          break;
        case 401:
          errorMessage =
            error.error ||
            'Invalid credentials. Please check your credentials and try again.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage =
            'An unexpected error occurred. Please try again later.';
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
