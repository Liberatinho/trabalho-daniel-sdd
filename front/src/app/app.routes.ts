import { Routes } from '@angular/router';

import { authGuard } from './core/routing/auth.guard';
import { RoutePlaceholderComponent } from './core/routing/route-placeholder.component';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { layout: 'authentication' }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { layout: 'authentication' }
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    component: RoutePlaceholderComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pets' },
      { path: 'pets', component: RoutePlaceholderComponent },
      { path: 'vaccines', component: RoutePlaceholderComponent },
      { path: 'consultations', component: RoutePlaceholderComponent },
      { path: 'reminders', component: RoutePlaceholderComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
