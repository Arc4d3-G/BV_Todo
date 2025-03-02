import { Routes } from '@angular/router';
import { AuthPageComponent } from './components/auth-page/auth-page.component';

export const routes: Routes = [
  { path: 'login', component: AuthPageComponent },
  { path: '**', redirectTo: 'login' },
];
