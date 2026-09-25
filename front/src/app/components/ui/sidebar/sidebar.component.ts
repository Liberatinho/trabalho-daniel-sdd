import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  readonly label: string;
  readonly route: string;
  readonly icon?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <a class="sidebar__brand" routerLink="/" aria-label="PetCare - início">
        <span class="sidebar__brand-mark" aria-hidden="true">P</span>
        <span>PetCare</span>
      </a>

      <nav class="sidebar__nav" aria-label="Navegação principal">
        @for (item of items; track item.route) {
          <a
            class="sidebar__link"
            [routerLink]="item.route"
            routerLinkActive="sidebar__link--active"
            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
          >
            <span class="sidebar__icon" aria-hidden="true">{{ item.icon ?? '•' }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="sidebar__profile">
        <ng-content select="[sidebar-profile]" />
      </div>
    </aside>
  `,
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() items: readonly SidebarItem[] = [
    { label: 'Início', route: '/', icon: '⌂' },
    { label: 'Meus pets', route: '/pets', icon: '♡' },
    { label: 'Vacinas', route: '/vaccines', icon: '✚' },
    { label: 'Consultas', route: '/consultations', icon: '▣' },
    { label: 'Lembretes', route: '/reminders', icon: '◷' }
  ];
}
