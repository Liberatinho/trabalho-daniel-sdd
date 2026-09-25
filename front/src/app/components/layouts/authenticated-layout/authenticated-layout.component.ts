import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { SidebarComponent } from '../../ui/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [
    AvatarComponent,
    ButtonComponent,
    HeaderComponent,
    RouterOutlet,
    SidebarComponent
  ],
  template: `
    <div class="authenticated-layout">
      <app-sidebar>
        <div sidebar-profile class="authenticated-layout__profile">
          <app-avatar
            [name]="userName()"
            [label]="'Perfil de ' + userName()"
          />
          <div class="authenticated-layout__profile-copy">
            <strong>{{ userName() }}</strong>
            <span>Tutor</span>
          </div>
          <app-button
            variant="text"
            aria-label="Sair da conta"
            (click)="logout()"
          >
            Sair
          </app-button>
        </div>
      </app-sidebar>

      <div class="authenticated-layout__main">
        <app-header
          [userName]="userName()"
          (notificationsClicked)="notificationsClicked()"
        />
        <main class="authenticated-layout__content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './authenticated-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly userName = computed(
    () => this.authService.currentUser()?.name ?? 'Usuário não autenticado'
  );

  notificationsClicked(): void {
    // The backend does not expose notifications yet.
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
