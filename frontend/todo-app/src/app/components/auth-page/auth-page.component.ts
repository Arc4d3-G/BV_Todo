import { NotificationService } from './../../services/notification.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
    LoginFormComponent,
    RegisterFormComponent,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {
  isRegistering = false;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }

  onRegistrationSuccess() {
    this.isRegistering = false;
    this.notificationService.show('Registration successful. Please log in.');
  }

  onLoginSuccess() {
    this.notificationService.show('Login successful.');
    this.router.navigate(['/home']);
  }
}
