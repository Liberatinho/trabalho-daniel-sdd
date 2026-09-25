import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  template: `
    <label class="field">
      <span class="field__label">
        {{ label }}
        @if (required) {
          <span class="field__required" aria-hidden="true">*</span>
        }
      </span>
      <select
        class="field__control"
        [id]="id"
        [value]="value"
        [disabled]="disabled"
        [attr.aria-describedby]="error ? id + '-error' : null"
        [attr.aria-invalid]="error ? 'true' : 'false'"
        [attr.required]="required || null"
        (change)="handleChange($event)"
        (blur)="handleBlur()"
      >
        <option value="" disabled>{{ placeholder }}</option>
        @for (option of options; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
      @if (error) {
        <span class="field__error" [id]="id + '-error'" role="alert">{{ error }}</span>
      }
    </label>
  `,
  styleUrls: ['../form-control.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor {
  @Input({ required: true }) id = '';
  @Input({ required: true }) label = '';
  @Input() placeholder = 'Selecione uma opção';
  @Input() options: readonly SelectOption[] = [];
  @Input() required = false;
  @Input() error = '';

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  handleChange(event: Event): void {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }
    this.value = select.value;
    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
