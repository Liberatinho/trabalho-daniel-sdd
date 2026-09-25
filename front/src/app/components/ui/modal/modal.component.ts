import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

let nextModalId = 0;

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open) {
      <div class="modal-backdrop" (click)="handleBackdropClick($event)">
        <section
          #dialog
          class="modal"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="description ? descriptionId : null"
        >
          <header class="modal__header">
            <div class="modal__heading">
              <h2 class="modal__title" [id]="titleId">{{ title }}</h2>
              @if (description) {
                <p class="modal__description" [id]="descriptionId">{{ description }}</p>
              }
            </div>
            <button
              #closeButton
              class="modal__close"
              type="button"
              aria-label="Fechar modal"
              (click)="close()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          <div class="modal__content">
            <ng-content select="[modal-content]" />
          </div>

          <footer class="modal__footer">
            <ng-content select="[modal-footer]" />
          </footer>
        </section>
      </div>
    }
  `,
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnChanges, AfterViewChecked {
  @Input() open = false;
  @Input({ required: true }) title = '';
  @Input() description = '';

  @Output() readonly closed = new EventEmitter<void>();

  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;
  @ViewChild('closeButton') private closeButton?: ElementRef<HTMLButtonElement>;

  readonly titleId = `modal-title-${nextModalId++}`;
  readonly descriptionId = `${this.titleId}-description`;

  private previousOpen = false;
  private elementToRestore?: HTMLElement;
  private hasFocusedInitialElement = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue === true && !this.previousOpen) {
      const activeElement = document.activeElement;
      this.elementToRestore =
        activeElement instanceof HTMLElement ? activeElement : undefined;
      this.hasFocusedInitialElement = false;
    }

    if (changes['open']?.currentValue === false && this.previousOpen) {
      this.elementToRestore?.focus();
      this.elementToRestore = undefined;
      this.hasFocusedInitialElement = false;
    }

    this.previousOpen = this.open;
  }

  ngAfterViewChecked(): void {
    if (this.open && !this.hasFocusedInitialElement && this.dialog && this.closeButton) {
      this.closeButton.nativeElement.focus();
      this.hasFocusedInitialElement = true;
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.open) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.open || event.key !== 'Tab' || !this.dialog) {
      return;
    }

    const focusableElements = this.getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  private getFocusableElements(): HTMLElement[] {
    if (!this.dialog) {
      return [];
    }

    return Array.from(
      this.dialog.nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }
}
