import { Routes } from '@angular/router';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'login' },
];
