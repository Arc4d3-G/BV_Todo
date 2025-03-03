import { AuthService } from '../../../services/auth.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  @Output() registrationSuccess = new EventEmitter<void>();
  registerForm: FormGroup;
  error: string | null = null;

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({
          ...confirmPasswordControl.errors,
          passwordMismatch: true,
        });
      } else {
        if (confirmPasswordControl.errors) {
          const { passwordMismatch, ...otherErrors } =
            confirmPasswordControl.errors;
          confirmPasswordControl.setErrors(
            Object.keys(otherErrors).length ? otherErrors : null
          );
        } else {
          confirmPasswordControl.setErrors(null);
        }
      }

      return null;
    };
  }

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[a-zA-Z0-9_-]+$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator(),
      }
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, username } = this.registerForm.value;

      this.authService.register(email, password, username).subscribe({
        next: () => {
          this.registrationSuccess.emit();
        },
        error: (err) => {
          this.error = err.message || 'Registration failed';
        },
      });
    }
  }
}
