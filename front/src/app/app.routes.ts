import { Routes } from '@angular/router';

import { authGuard } from './core/routing/auth.guard';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthenticatedLayoutComponent } from './components/layouts/authenticated-layout/authenticated-layout.component';
import { PetsComponent } from './pages/pets/pets.component';
import { PetCreateComponent } from './pages/pet-create/pet-create.component';
import { VaccinesComponent } from './pages/vaccines/vaccines.component';
import { ConsultationsComponent } from './pages/consultations/consultations.component';
import { RemindersComponent } from './pages/reminders/reminders.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
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
    component: AuthenticatedLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pets' },
      { path: 'pets/new', component: PetCreateComponent },
      { path: 'pets', component: PetsComponent },
      { path: 'vaccines', component: VaccinesComponent },
      { path: 'consultations', component: ConsultationsComponent },
      { path: 'reminders', component: RemindersComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
