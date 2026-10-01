import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <aside class="auth-layout__panel">
        <div class="auth-layout__brand">
          <span class="auth-layout__brand-mark" aria-hidden="true">P</span>
          <span>PetCare</span>
        </div>
        <div class="auth-layout__message">
          <span class="auth-layout__eyebrow">Cuidado em um só lugar</span>
          <h1>Uma rotina mais tranquila para você e seu pet.</h1>
          <p>
            Organize informações de saúde, consultas e cuidados com uma experiência
            simples e acolhedora.
          </p>
        </div>
        <div class="auth-layout__dots" aria-hidden="true">
          <span class="auth-layout__dot auth-layout__dot--active"></span>
          <span class="auth-layout__dot"></span>
          <span class="auth-layout__dot"></span>
        </div>
      </aside>

      <main class="auth-layout__content">
        <section class="auth-layout__card">
          <router-outlet />
        </section>
      </main>
    </div>
  `,
  styleUrl: './auth-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {}
