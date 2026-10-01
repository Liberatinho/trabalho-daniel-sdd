import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading" role="status" aria-live="polite">
      <span class="loading__spinner" aria-hidden="true"></span>
      <span>{{ label }}</span>
    </div>
  `,
  styleUrl: './loading.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  @Input() label = 'Carregando...';
}
