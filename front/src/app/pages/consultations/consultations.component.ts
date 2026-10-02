import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { ConfirmDeleteComponent } from '../../components/ui/confirm-delete/confirm-delete.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { LoadingComponent } from '../../components/ui/loading/loading.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { SearchComponent } from '../../components/ui/search/search.component';
import { SelectComponent } from '../../components/ui/select/select.component';
import { TableComponent } from '../../components/ui/table/table.component';
import { TextareaComponent } from '../../components/ui/textarea/textarea.component';
import { ApiHttpError } from '../../core/http/api-error';
import { ConsultationListItem, ConsultationStatus } from '../../models/consultation.model';
import { Pet } from '../../models/pet.model';
import { AuthService } from '../../services/auth.service';
import { ConsultationService } from '../../services/consultation.service';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [
    AlertComponent, BadgeComponent, ButtonComponent, CardComponent, ConfirmDeleteComponent,
    EmptyStateComponent, InputComponent, LoadingComponent, ModalComponent, ReactiveFormsModule,
    SearchComponent, SelectComponent, TableComponent, TextareaComponent
  ],
  template: `
    <div class="consultations-page">
      <header class="consultations-page__heading">
        <div>
          <span>Cuidados</span>
          <h1>Consultas e Atendimentos</h1>
          <p>Acompanhe a agenda veterinária dos seus pets.</p>
        </div>
        <app-button type="button" (click)="openModal()">Agendar Nova Consulta</app-button>
      </header>

      <div class="consultations-page__toolbar">
        <app-search id="consultations-search" label="Buscar consulta" placeholder="Pet, veterinário ou motivo"
          [value]="service.search()" (valueChange)="service.setSearch($event)" />
        <app-select id="consultations-pet" label="Pet" [options]="petOptions()" [formControl]="petFilter" />
        <app-select id="consultations-status" label="Status" [options]="statusOptions" [formControl]="statusFilter" />
      </div>

      @if (errorMessage()) {
        <app-alert variant="error" title="Não foi possível carregar as consultas" [message]="errorMessage()" />
      }
      @if (successMessage()) {
        <app-alert variant="success" title="Agenda atualizada" [message]="successMessage()" />
      }
      @if (isBusy()) {
        <app-loading label="Carregando agenda veterinária..." />
      } @else if (!errorMessage()) {
        <app-card title="Agenda Veterinária">
          @if (service.filteredItems().length === 0) {
            <app-empty-state [title]="hasFilters() ? 'Nenhuma consulta encontrada' : 'Nenhuma consulta agendada'"
              message="Ajuste os filtros ou agende uma nova consulta." />
          } @else {
            <app-table label="Agenda veterinária">
              <thead><tr>
                <th>Pet</th><th>Veterinário(a)</th><th>Data</th><th>Horário</th>
                <th>Motivo</th><th>Status</th><th>Observações</th><th>Ações</th>
              </tr></thead>
              <tbody>
                @for (item of service.filteredItems(); track item.consultation.id) {
                  <tr>
                    <td>{{ item.pet.name }}</td>
                    <td>{{ item.consultation.veterinarian }}</td>
                    <td>{{ date(item.consultation.date) }}</td>
                    <td>{{ time(item.consultation.date) }}</td>
                    <td>{{ item.consultation.reason }}</td>
                    <td><app-badge>{{ statusLabel(item.consultation.status) }}</app-badge></td>
                    <td>{{ item.consultation.notes || '—' }}</td>
                    <td><div class="record-actions">
                      <button class="record-action" type="button" (click)="openEdit(item)"
                        [disabled]="item.consultation.status === cancelledStatus"
                        [title]="item.consultation.status === cancelledStatus ? 'Consultas canceladas não podem ser alteradas' : 'Editar consulta'">Editar</button>
                      <button class="record-action record-action--danger" type="button" (click)="openDelete(item)"
                        [attr.aria-label]="'Excluir consulta de ' + item.pet.name">Excluir</button>
                    </div></td>
                  </tr>
                }
              </tbody>
            </app-table>
          }
        </app-card>
      }

      <app-modal [open]="modalOpen()" [title]="editingItem() ? 'Editar consulta' : 'Agendar nova consulta'"
        [description]="editingItem() ? 'Atualize os dados do atendimento.' : 'Informe os dados do atendimento.'"
        (closed)="closeModal()">
        <form class="consultations-page__form" [formGroup]="form" (ngSubmit)="submit()" modal-content>
          @if (formError()) { <app-alert variant="error" title="Não foi possível salvar" [message]="formError()" /> }
          @if (editingItem(); as item) {
            <p class="consultations-page__pet-label">Pet: <strong>{{ item.pet.name }}</strong></p>
          } @else {
            <app-select id="consultation-pet" label="Pet" [required]="true" [options]="createPetOptions()"
              [error]="fieldError('petId')" formControlName="petId" />
          }
          <app-input id="consultation-date" type="datetime-local" label="Data e horário" [required]="true"
            [error]="fieldError('date')" formControlName="date" />
          <app-input id="consultation-vet" label="Veterinário(a)" [required]="true"
            [error]="fieldError('veterinarian')" formControlName="veterinarian" />
          <app-input id="consultation-reason" label="Motivo" [required]="true"
            [error]="fieldError('reason')" formControlName="reason" />
          <app-select id="consultation-status" label="Status" [required]="true"
            [options]="formStatusOptions()" formControlName="status" />
          <app-textarea id="consultation-notes" label="Observações" formControlName="notes" />
        </form>
        <div class="consultations-page__actions" modal-footer>
          <app-button variant="secondary" type="button" [disabled]="submitting()" (click)="closeModal()">Cancelar</app-button>
          <app-button type="button" [loading]="submitting()" (click)="submit()">
            {{ editingItem() ? 'Salvar alterações' : 'Agendar consulta' }}
          </app-button>
        </div>
      </app-modal>

      <app-confirm-delete [open]="deletingItem() !== null" title="Excluir consulta?"
        [message]="'A consulta de ' + (deletingItem()?.pet?.name ?? 'seu pet') + ' será removida da agenda.'"
        [error]="deleteError()" [loading]="deleting()"
        (canceled)="closeDelete()" (confirmed)="confirmDelete()" />
    </div>
  `,
  styleUrl: './consultations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationsComponent implements OnInit {
  readonly service = inject(ConsultationService);
  private readonly pets = inject(PetService);
  private readonly auth = inject(AuthService);

  readonly cancelledStatus = ConsultationStatus.Cancelled;
  readonly petFilter = new FormControl('all', { nonNullable: true });
  readonly statusFilter = new FormControl('all', { nonNullable: true });
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly petOptions = signal<readonly { value: string; label: string }[]>([{ value: 'all', label: 'Todos os pets' }]);
  readonly petList = signal<readonly Pet[]>([]);
  readonly modalOpen = signal(false);
  readonly editingItem = signal<ConsultationListItem | null>(null);
  readonly deletingItem = signal<ConsultationListItem | null>(null);
  readonly submitting = signal(false);
  readonly deleting = signal(false);
  readonly formError = signal('');
  readonly deleteError = signal('');
  readonly form = new FormGroup({
    petId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    veterinarian: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    reason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl(ConsultationStatus.Scheduled, { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true })
  });
  readonly statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: ConsultationStatus.Scheduled, label: 'Agendada' },
    { value: ConsultationStatus.Completed, label: 'Realizada' },
    { value: ConsultationStatus.Cancelled, label: 'Cancelada' }
  ];
  readonly isBusy = computed(() => this.pets.isLoading() || this.service.isLoading());
  readonly hasFilters = computed(() => !!this.service.search() || this.service.petId() !== null || this.service.status() !== null);
  readonly createPetOptions = computed(() => this.petList().map(pet => ({ value: String(pet.id), label: pet.name })));
  readonly formStatusOptions = computed(() => this.statusOptions.slice(1).filter(option =>
    this.editingItem()?.consultation.status !== ConsultationStatus.Completed || option.value !== ConsultationStatus.Scheduled
  ));

  ngOnInit(): void {
    this.petFilter.valueChanges.subscribe(value => this.service.setPetId(value === 'all' ? null : Number(value)));
    this.statusFilter.valueChanges.subscribe(value => this.service.setStatus(value === 'all' ? null : value as ConsultationStatus));
    const userId = this.auth.currentUser()?.id;
    if (userId === undefined) {
      this.errorMessage.set('Nenhum usuário autenticado está disponível.');
      return;
    }
    this.pets.listPets(userId).subscribe({
      next: pets => {
        this.petList.set(pets);
        this.petOptions.set([{ value: 'all', label: 'Todos os pets' }, ...pets.map(pet => ({ value: String(pet.id), label: pet.name }))]);
        this.service.listConsultations(userId, pets).subscribe({ error: error => this.handleError(error) });
      },
      error: error => this.handleError(error, 'Não foi possível carregar os pets.')
    });
  }

  openModal(): void {
    this.formError.set('');
    this.editingItem.set(null);
    this.form.reset({ petId: '', date: '', veterinarian: '', reason: '', status: ConsultationStatus.Scheduled, notes: '' });
    this.modalOpen.set(true);
  }

  openEdit(item: ConsultationListItem): void {
    if (item.consultation.status === ConsultationStatus.Cancelled) return;
    this.formError.set('');
    this.successMessage.set('');
    this.editingItem.set(item);
    this.form.reset({
      petId: String(item.pet.id),
      date: item.consultation.date.slice(0, 16),
      veterinarian: item.consultation.veterinarian,
      reason: item.consultation.reason,
      status: item.consultation.status,
      notes: item.consultation.notes ?? ''
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (!this.submitting()) this.modalOpen.set(false);
  }

  submit(): void {
    this.formError.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const userId = this.auth.currentUser()?.id;
    const values = this.form.getRawValue();
    const pet = this.petList().find(candidate => candidate.id === Number(values.petId));
    if (userId === undefined || !pet) {
      this.formError.set('Não foi possível identificar o pet.');
      return;
    }
    const request = {
      date: values.date,
      veterinarian: values.veterinarian,
      reason: values.reason,
      status: values.status,
      ...(values.notes ? { notes: values.notes } : {})
    };
    const editing = this.editingItem();
    const action = editing
      ? this.service.updateConsultation(userId, editing, request)
      : this.service.createConsultation(userId, pet, request);
    this.submitting.set(true);
    action.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.modalOpen.set(false);
        this.editingItem.set(null);
        this.successMessage.set(editing ? 'A consulta foi atualizada.' : 'A consulta foi agendada.');
      },
      error: error => this.formError.set(error instanceof ApiHttpError ? error.message : 'Não foi possível salvar a consulta.')
    });
  }

  openDelete(item: ConsultationListItem): void {
    this.deleteError.set('');
    this.successMessage.set('');
    this.deletingItem.set(item);
  }

  closeDelete(): void {
    if (!this.deleting()) this.deletingItem.set(null);
  }

  confirmDelete(): void {
    const item = this.deletingItem();
    const userId = this.auth.currentUser()?.id;
    if (!item || userId === undefined) return;
    this.deleting.set(true);
    this.service.deleteConsultation(userId, item).pipe(finalize(() => this.deleting.set(false))).subscribe({
      next: () => {
        this.deletingItem.set(null);
        this.successMessage.set('A consulta foi excluída.');
      },
      error: error => this.deleteError.set(error instanceof ApiHttpError ? error.message : 'Não foi possível excluir a consulta.')
    });
  }

  fieldError(field: 'petId' | 'date' | 'veterinarian' | 'reason'): string {
    const control = this.form.controls[field];
    return control.touched && control.hasError('required') ? 'Campo obrigatório.' : '';
  }

  date(value: string): string {
    const [date] = value.split('T');
    const [year, month, day] = date.split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  }

  time(value: string): string {
    return value.split('T')[1]?.slice(0, 5) || '—';
  }

  statusLabel(status: ConsultationStatus): string {
    return ({ SCHEDULED: 'Agendada', COMPLETED: 'Realizada', CANCELLED: 'Cancelada' } as Record<string, string>)[status] || status;
  }

  private handleError(error: unknown, fallback = 'Não foi possível carregar as consultas.'): void {
    this.errorMessage.set(error instanceof ApiHttpError ? error.message : fallback);
  }
}
