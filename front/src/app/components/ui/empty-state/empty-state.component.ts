import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <section class="empty-state" aria-live="polite">
      <div class="empty-state__icon" aria-hidden="true">○</div>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <ng-content />
    </section>
  `,
  styleUrl: './empty-state.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input() title = 'Nenhum registro encontrado';
  @Input() message = 'Ainda não há dados para exibir.';
}
