import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="badge"
      [class.badge--neutral]="variant === 'neutral'"
      [class.badge--success]="variant === 'success'"
      [class.badge--warning]="variant === 'warning'"
      [class.badge--danger]="variant === 'danger'"
      [class.badge--info]="variant === 'info'"
    >
      <ng-content />
    </span>
  `,
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
}
