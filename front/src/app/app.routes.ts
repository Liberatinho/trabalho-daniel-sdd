import { Routes } from '@angular/router';

import { authGuard } from './core/routing/auth.guard';
import { RoutePlaceholderComponent } from './core/routing/route-placeholder.component';

export const routes: Routes = [
  {
    path: 'login',
    component: RoutePlaceholderComponent,
    data: { layout: 'authentication' }
  },
  {
    path: 'register',
    component: RoutePlaceholderComponent,
    data: { layout: 'authentication' }
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
