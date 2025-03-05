import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/user';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  // Expose the current todos and username state as an observable
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  // Register a new user
  register(email: string, password: string, username: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, { email, password, username })
      .pipe(catchError(this.handleError));
  }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.loggedInSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }

  // Get current authenticated user
  getCurrentUser(): Observable<User | null> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>(`${this.apiUrl}/me`, { headers }).pipe(
      tap((user) => {
        console.log({ user: user });
        this.loggedInSubject.next(true);
        this.userSubject.next(user);
      }),
      catchError((err) => {
        this.loggedInSubject.next(false);
        this.userSubject.next(null);
        return throwError(() => err);
      })
    );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
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
