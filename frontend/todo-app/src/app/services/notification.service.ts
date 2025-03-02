import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'bottom', // 'top' or 'bottom'
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      panelClass: ['snackbar-success'], // You can define styles in global styles.css
    });
  }

  showError(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['snackbar-error'],
    });
  }
}
