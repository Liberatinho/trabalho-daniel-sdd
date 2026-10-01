import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <label class="search">
      <span class="search__label">{{ label }}</span>
      <span class="search__control">
        <span class="search__icon" aria-hidden="true">&#128269;</span>
        <input
          [id]="id"
          type="search"
          [value]="value"
          [placeholder]="placeholder"
          [attr.aria-label]="label"
          (input)="handleInput($event)"
        />
        @if (value) {
          <button
            class="search__clear"
            type="button"
            aria-label="Limpar busca"
            (click)="clear()"
          >
            &times;
          </button>
        }
      </span>
    </label>
  `,
  styleUrl: './search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  @Input() id = 'search';
  @Input() label = 'Buscar';
  @Input() placeholder = 'Buscar...';
  @Input() value = '';

  @Output() readonly valueChange = new EventEmitter<string>();

  handleInput(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    this.value = input.value;
    this.valueChange.emit(this.value);
  }

  clear(): void {
    this.value = '';
    this.valueChange.emit(this.value);
  }
}
