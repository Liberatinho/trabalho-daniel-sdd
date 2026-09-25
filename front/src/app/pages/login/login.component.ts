import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { LoginRequest } from '../../models/user.model';
import {
  AuthService,
  AuthenticationUnavailableError
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="login">
      <div class="login__heading">
        <span class="login__badge">Acesso restrito</span>
        <h2>Bem-vindo de volta</h2>
        <p>Entre para acompanhar os cuidados do seu pet.</p>
      </div>

      @if (errorMessage) {
        <app-alert variant="error" title="Não foi possível entrar" [message]="errorMessage" />
      }

      <form class="login__form" [formGroup]="form" (ngSubmit)="submit()">
        <app-input
          id="login-email"
          label="E-mail"
          type="email"
          autocomplete="email"
          placeholder="voce@exemplo.com"
          [required]="true"
          [error]="fieldError('email')"
          formControlName="email"
        />
        <app-input
          id="login-password"
          label="Senha"
          type="password"
          autocomplete="current-password"
          placeholder="Digite sua senha"
          [required]="true"
          [error]="fieldError('password')"
          formControlName="password"
        />

        <div class="login__actions">
          <span class="login__recovery">
            Recuperação de senha indisponível no backend atual.
          </span>
          <app-button type="submit" [loading]="isSubmitting">Entrar</app-button>
        </div>
      </form>

      <p class="login__register">
        Ainda não tem uma conta?
        <a routerLink="/register">Cadastre-se</a>
      </p>
    </div>
  `,
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  readonly form = new FormGroup({
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
    const request: LoginRequest = this.form.getRawValue();
    this.authService
      .login(request)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        error: (error: unknown) => {
          this.errorMessage =
            error instanceof AuthenticationUnavailableError
              ? error.message
              : 'Não foi possível concluir o login.';
        }
      });
  }

  fieldError(field: 'email' | 'password'): string {
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
