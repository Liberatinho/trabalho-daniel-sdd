import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { CreateUserRequest } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ApiHttpError } from '../../core/http/api-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="register">
      <div class="register__heading">
        <span class="register__badge">Novo cadastro</span>
        <h2>Crie sua conta</h2>
        <p>Cadastre seus dados para começar a organizar os cuidados do seu pet.</p>
      </div>

      @if (errorMessage) {
        <app-alert
          variant="error"
          title="Não foi possível criar sua conta"
          [message]="errorMessage"
        />
      }

      <form class="register__form" [formGroup]="form" (ngSubmit)="submit()">
        <app-input
          id="register-name"
          label="Nome"
          autocomplete="name"
          placeholder="Seu nome"
          [required]="true"
          [error]="fieldError('name')"
          formControlName="name"
        />
        <app-input
          id="register-email"
          label="E-mail"
          type="email"
          autocomplete="email"
          placeholder="voce@exemplo.com"
          [required]="true"
          [error]="fieldError('email')"
          formControlName="email"
        />
        <app-input
          id="register-password"
          label="Senha"
          type="password"
          autocomplete="new-password"
          placeholder="Crie uma senha"
          [required]="true"
          [error]="fieldError('password')"
          formControlName="password"
        />

        <p class="register__terms">
          Ao criar uma conta, você concorda em usar o PetCare para organizar as
          informações de cuidado dos seus pets.
        </p>

        <app-button type="submit" [loading]="isSubmitting">Criar conta</app-button>
      </form>

      <p class="register__login">
        Já possui uma conta?
        <a routerLink="/login">Voltar para o login</a>
      </p>
    </div>
  `,
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  isSubmitting = false;
  errorMessage = '';

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const request: CreateUserRequest = this.form.getRawValue();
    this.authService
      .register(request)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/login'], {
            queryParams: { registered: 'true' }
          });
        },
        error: (error: unknown) => {
          this.errorMessage =
            error instanceof ApiHttpError
              ? error.message
              : 'Não foi possível criar sua conta.';
        }
      });
  }

  fieldError(field: 'name' | 'email' | 'password'): string {
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Campo obrigatório.';
    }
    if (control.hasError('email')) {
      return 'Informe um e-mail válido.';
    }
    return 'Valor inválido.';
  }
}
