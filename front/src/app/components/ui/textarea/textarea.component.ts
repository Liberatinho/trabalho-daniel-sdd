import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  template: `
    <label class="field">
      <span class="field__label">
        {{ label }}
        @if (required) {
          <span class="field__required" aria-hidden="true">*</span>
        }
      </span>
      <textarea
        class="field__control"
        [id]="id"
        [value]="value"
        [placeholder]="placeholder"
        [rows]="rows"
        [disabled]="disabled"
        [attr.aria-describedby]="error ? id + '-error' : null"
        [attr.aria-invalid]="error ? 'true' : 'false'"
        [attr.required]="required || null"
        (input)="handleInput($event)"
        (blur)="handleBlur()"
      ></textarea>
      @if (error) {
        <span class="field__error" [id]="id + '-error'" role="alert">{{ error }}</span>
      }
    </label>
  `,
  styleUrls: ['../form-control.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements ControlValueAccessor {
  @Input({ required: true }) id = '';
  @Input({ required: true }) label = '';
  @Input() placeholder = '';
  @Input() rows = 4;
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

  handleInput(event: Event): void {
    const textarea = event.target;
    if (!(textarea instanceof HTMLTextAreaElement)) {
      return;
    }
    this.value = textarea.value;
    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
