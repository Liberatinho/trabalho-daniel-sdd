import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <section class="card" [class.card--interactive]="interactive">
      @if (title || subtitle) {
        <header class="card__header">
          @if (title) {
            <h2 class="card__title">{{ title }}</h2>
          }
          @if (subtitle) {
            <p class="card__subtitle">{{ subtitle }}</p>
          }
        </header>
      }
      <div class="card__content">
        <ng-content />
      </div>
    </section>
  `,
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() interactive = false;
}
