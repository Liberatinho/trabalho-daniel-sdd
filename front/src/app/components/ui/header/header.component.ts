import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <header class="header">
      <div class="header__context">
        @if (title) {
          <h1>{{ title }}</h1>
        }
        @if (subtitle) {
          <p>{{ subtitle }}</p>
        }
      </div>

      <div class="header__actions">
        <button
          class="header__notifications"
          type="button"
          aria-label="Notificações"
          (click)="notificationsClicked.emit()"
        >
          <span aria-hidden="true">♧</span>
          @if (notificationCount > 0) {
            <span class="header__count" aria-label="Notificações não lidas">
              {{ notificationCount }}
            </span>
          }
        </button>
        <div class="header__profile">
          <app-avatar [name]="userName" [label]="'Perfil de ' + userName" />
          <span>{{ userName }}</span>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input({ required: true }) userName = '';
  @Input() notificationCount = 0;

  @Output() readonly notificationsClicked = new EventEmitter<void>();
}
