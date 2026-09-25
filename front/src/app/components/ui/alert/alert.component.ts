import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    <div
      class="alert"
      [class.alert--success]="variant === 'success'"
      [class.alert--error]="variant === 'error'"
      [class.alert--warning]="variant === 'warning'"
      [class.alert--info]="variant === 'info'"
      [attr.role]="variant === 'error' ? 'alert' : 'status'"
    >
      @if (title) {
        <strong>{{ title }}</strong>
      }
      <span>{{ message }}</span>
    </div>
  `,
  styleUrl: './alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {
  @Input({ required: true }) message = '';
  @Input() title = '';
  @Input() variant: AlertVariant = 'info';
}
