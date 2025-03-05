import { AuthService } from '../../../services/auth.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
    MatProgressSpinner,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  loading: boolean = false;
  loginForm: FormGroup;
  error: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.loginSuccess.emit();
          },
          error: (err) => {
            this.loading = false;
            this.error = err.message || 'Invalid credentials';
          },
        });
    }
  }
}
