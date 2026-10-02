import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AlertComponent } from '../alert/alert.component';
import { ButtonComponent } from '../button/button.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [AlertComponent, ButtonComponent, ModalComponent],
  template: `
    <app-modal [open]="open" [title]="title" [description]="description" (closed)="cancel()">
      <div class="confirm-delete__content" modal-content>
        <p>{{ message }}</p>
        @if (error) {
          <app-alert variant="error" title="Não foi possível excluir" [message]="error" />
        }
      </div>
      <div class="confirm-delete__actions" modal-footer>
        <app-button variant="secondary" type="button" [disabled]="loading" (click)="cancel()">Cancelar</app-button>
        <app-button variant="danger" type="button" [loading]="loading" (click)="confirmed.emit()">Excluir</app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .confirm-delete__content { display: grid; gap: var(--space-4); color: var(--color-text-secondary); }
    .confirm-delete__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: var(--space-3); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteComponent {
  @Input() open = false;
  @Input() title = 'Excluir registro?';
  @Input() description = 'Esta ação não pode ser desfeita.';
  @Input() message = '';
  @Input() error = '';
  @Input() loading = false;

  @Output() readonly canceled = new EventEmitter<void>();
  @Output() readonly confirmed = new EventEmitter<void>();

  cancel(): void {
    if (!this.loading) this.canceled.emit();
  }
}
