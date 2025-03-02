import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5014/api/user'; // Adjust if needed

  constructor(private http: HttpClient) {}

  // Register a new user
  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      password,
      username,
    });
  }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Get current authenticated user
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token
    if (!token) {
      return new Observable((observer) => {
        observer.error('No token found');
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token'); // Remove token from storage
  }
}
