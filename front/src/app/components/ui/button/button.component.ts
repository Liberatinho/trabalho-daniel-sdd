import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'text';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      class="button"
      [class.button--primary]="variant === 'primary'"
      [class.button--secondary]="variant === 'secondary'"
      [class.button--text]="variant === 'text'"
      [disabled]="disabled || loading"
      [attr.type]="type"
      [attr.aria-busy]="loading"
    >
      @if (loading) {
        <span class="button__spinner" aria-hidden="true"></span>
        <span>Carregando...</span>
      } @else {
        <ng-content />
      }
    </button>
  `,
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
}
