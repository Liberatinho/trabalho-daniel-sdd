import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { BadgeComponent } from '../../components/ui/badge/badge.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { DateInputComponent } from '../../components/ui/date-input/date-input.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { LoadingComponent } from '../../components/ui/loading/loading.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { SearchComponent } from '../../components/ui/search/search.component';
import { SelectComponent } from '../../components/ui/select/select.component';
import { ApiHttpError } from '../../core/http/api-error';
import { Pet } from '../../models/pet.model';
import { ReminderListItem, ReminderType } from '../../models/reminder.model';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';
import { ReminderService } from '../../services/reminder.service';

interface ReminderGroup {
  readonly type: ReminderType;
  readonly label: string;
  readonly items: readonly ReminderListItem[];
}

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    DateInputComponent,
    EmptyStateComponent,
    InputComponent,
    LoadingComponent,
    ModalComponent,
    ReactiveFormsModule,
    SearchComponent,
    SelectComponent
  ],
  template: `
    <div class="reminders-page">
      <header class="reminders-page__heading">
        <div>
          <span class="reminders-page__eyebrow">Cuidados</span>
          <h1>Central de Lembretes &amp; Cuidados</h1>
          <p>Organize os cuidados importantes de cada pet em um só lugar.</p>
        </div>
        <app-button type="button" (click)="openCreateModal()">Criar Novo Lembrete</app-button>
      </header>

      <div class="reminders-page__toolbar">
        <app-search
          id="reminders-search"
          label="Buscar lembrete"
          placeholder="Título ou pet"
          [value]="reminderService.search()"
          (valueChange)="reminderService.setSearch($event)"
        />
        <app-select id="reminders-pet-filter" label="Pet" [options]="petOptions()" [formControl]="petFilter" />
        <app-select id="reminders-type-filter" label="Categoria" [options]="typeOptions" [formControl]="typeFilter" />
        <app-select id="reminders-status-filter" label="Status" [options]="completedOptions" [formControl]="completedFilter" />
      </div>

      @if (errorMessage()) {
        <app-alert title="Não foi possível carregar os lembretes" variant="error" [message]="errorMessage()" />
      }

      @if (successMessage()) {
        <app-alert title="Lembrete criado" variant="success" [message]="successMessage()" />
      }

      @if (isBusy()) {
        <app-loading label="Carregando lembretes..." />
      } @else if (!errorMessage()) {
        @if (reminderService.filteredItems().length === 0) {
          <app-empty-state [title]="emptyTitle()" [message]="emptyMessage()" />
        } @else {
          <div class="reminders-page__groups">
            @for (group of groups(); track group.type) {
              @if (group.items.length > 0) {
                <app-card [title]="group.label">
                  <ul class="reminders-page__list">
                    @for (item of group.items; track item.reminder.id) {
                      <li class="reminders-page__item">
                        <div class="reminders-page__item-copy">
                          <h2>{{ item.reminder.description }}</h2>
                          <p>{{ item.pet.name }}</p>
                        </div>
                        <div class="reminders-page__item-meta">
                          <app-badge [variant]="item.reminder.completed ? 'success' : 'neutral'">
                            {{ item.reminder.completed ? 'Concluído' : 'Pendente' }}
                          </app-badge>
                          <span>Data limite: {{ formatDate(item.reminder.dueDate) }}</span>
                        </div>
                      </li>
                    }
                  </ul>
                </app-card>
              }
            }
          </div>
        }
      }

      <app-modal
        [open]="isCreateModalOpen()"
        title="Criar novo lembrete"
        description="Registre um cuidado importante para um dos seus pets."
        (closed)="closeCreateModal()"
      >
        <form class="reminders-page__form" [formGroup]="createForm" modal-content>
          @if (createErrorMessage()) {
            <app-alert title="Não foi possível criar o lembrete" variant="error" [message]="createErrorMessage()" />
          }
          <app-select
            id="reminder-pet"
            label="Pet"
            placeholder="Selecione o pet"
            [required]="true"
            [options]="createPetOptions()"
            [error]="createFieldError('petId')"
            formControlName="petId"
          />
          <app-select
            id="reminder-type"
            label="Categoria"
            placeholder="Selecione a categoria"
            [required]="true"
            [options]="createTypeOptions"
            [error]="createFieldError('type')"
            formControlName="type"
          />
          <app-input
            id="reminder-description"
            label="Título do lembrete"
            placeholder="Ex.: Reforço da vacina"
            [required]="true"
            [error]="createFieldError('description')"
            formControlName="description"
          />
          <app-date-input
            id="reminder-due-date"
            label="Data limite"
            [required]="true"
            [error]="createFieldError('dueDate')"
            formControlName="dueDate"
          />
        </form>
        <div class="reminders-page__modal-actions" modal-footer>
          <app-button variant="secondary" type="button" [disabled]="isSubmitting()" (click)="closeCreateModal()">Cancelar</app-button>
          <app-button type="button" [loading]="isSubmitting()" (click)="submitCreate()">Criar lembrete</app-button>
        </div>
      </app-modal>
    </div>
  `,
  styleUrl: './reminders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersComponent implements OnInit {
  readonly reminderService = inject(ReminderService);
  private readonly petService = inject(PetService);
  private readonly authService = inject(AuthService);

  readonly petFilter = new FormControl('all', { nonNullable: true });
  readonly typeFilter = new FormControl('all', { nonNullable: true });
  readonly completedFilter = new FormControl('all', { nonNullable: true });
  readonly pets = signal<readonly Pet[]>([]);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly isCreateModalOpen = signal(false);
  readonly isSubmitting = signal(false);
  readonly createErrorMessage = signal('');
  readonly petOptions = signal<readonly { value: string; label: string }[]>([
    { value: 'all', label: 'Todos os pets' }
  ]);
  readonly typeOptions = [
    { value: 'all', label: 'Todas as categorias' },
    { value: ReminderType.Vaccine, label: 'Vacinas' },
    { value: ReminderType.Consultation, label: 'Consultas' },
    { value: ReminderType.Medication, label: 'Remédios' },
    { value: ReminderType.Other, label: 'Outros' }
  ];
  readonly completedOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'false', label: 'Pendentes' },
    { value: 'true', label: 'Concluídos' }
  ];
  readonly createTypeOptions = this.typeOptions.slice(1);
  readonly createForm = new FormGroup({
    petId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });
  readonly isBusy = computed(() => this.petService.isLoading() || this.reminderService.isLoading());
  readonly groups = computed<readonly ReminderGroup[]>(() =>
    [
      [ReminderType.Vaccine, 'Vacinas'],
      [ReminderType.Consultation, 'Consultas'],
      [ReminderType.Medication, 'Remédios'],
      [ReminderType.Other, 'Outros']
    ].map(([type, label]) => ({
      type: type as ReminderType,
      label,
      items: this.reminderService.filteredItems().filter(item => item.reminder.type === type)
    }))
  );
  readonly hasFilters = computed(() =>
    this.reminderService.search().trim().length > 0 ||
    this.reminderService.petId() !== null ||
    this.reminderService.type() !== null ||
    this.reminderService.completed() !== null
  );
  readonly emptyTitle = computed(() =>
    this.hasFilters() ? 'Nenhum lembrete encontrado' : 'Nenhum lembrete cadastrado'
  );
  readonly emptyMessage = computed(() =>
    this.hasFilters()
      ? 'Ajuste a busca ou os filtros para visualizar outros lembretes.'
      : 'Crie o primeiro lembrete para organizar os cuidados dos seus pets.'
  );

  ngOnInit(): void {
    this.petFilter.valueChanges.subscribe(value =>
      this.reminderService.setPetId(value === 'all' ? null : Number(value))
    );
    this.typeFilter.valueChanges.subscribe(value =>
      this.reminderService.setType(value === 'all' ? null : value as ReminderType)
    );
    this.completedFilter.valueChanges.subscribe(value =>
      this.reminderService.setCompleted(value === 'all' ? null : value === 'true')
    );

    const userId = this.authService.currentUser()?.id;
    if (userId === undefined) {
      this.errorMessage.set('Nenhum usuário autenticado está disponível.');
      return;
    }

    this.petService.listPets(userId).subscribe({
      next: pets => {
        this.pets.set(pets);
        this.petOptions.set([
          { value: 'all', label: 'Todos os pets' },
          ...pets.map(pet => ({ value: String(pet.id), label: pet.name }))
        ]);
        this.reminderService.listReminders(userId, pets).subscribe({
          error: error => this.handleError(error)
        });
      },
      error: error => this.handleError(error, 'Não foi possível carregar os pets.')
    });
  }

  formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  }

  readonly createPetOptions = computed(() =>
    this.pets().map(pet => ({ value: String(pet.id), label: pet.name }))
  );

  openCreateModal(): void {
    this.createErrorMessage.set('');
    this.successMessage.set('');
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    if (!this.isSubmitting()) {
      this.isCreateModalOpen.set(false);
    }
  }

  submitCreate(): void {
    this.createErrorMessage.set('');
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.currentUser()?.id;
    const values = this.createForm.getRawValue();
    const pet = this.pets().find(candidate => candidate.id === Number(values.petId));
    if (userId === undefined || !pet) {
      this.createErrorMessage.set('Não foi possível identificar o pet selecionado.');
      return;
    }

    this.isSubmitting.set(true);
    this.reminderService
      .createReminder(userId, pet, {
        type: values.type as ReminderType,
        description: values.description,
        dueDate: values.dueDate
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.createForm.reset({ petId: '', type: '', description: '', dueDate: '' });
          this.isCreateModalOpen.set(false);
          this.successMessage.set('O lembrete foi adicionado à central de cuidados.');
        },
        error: error => this.createErrorMessage.set(
          error instanceof ApiHttpError ? error.message : 'Não foi possível criar o lembrete.'
        )
      });
  }

  createFieldError(field: 'petId' | 'type' | 'description' | 'dueDate'): string {
    const control = this.createForm.controls[field];
    return control.touched && control.hasError('required') ? 'Campo obrigatório.' : '';
  }

  private handleError(error: unknown, fallback = 'Não foi possível carregar os lembretes.'): void {
    this.errorMessage.set(error instanceof ApiHttpError ? error.message : fallback);
  }
}
