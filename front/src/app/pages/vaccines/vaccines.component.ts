import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { DateInputComponent } from '../../components/ui/date-input/date-input.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { LoadingComponent } from '../../components/ui/loading/loading.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { SearchComponent } from '../../components/ui/search/search.component';
import { SelectComponent } from '../../components/ui/select/select.component';
import { TableComponent } from '../../components/ui/table/table.component';
import { TextareaComponent } from '../../components/ui/textarea/textarea.component';
import { ApiHttpError } from '../../core/http/api-error';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';
import { VaccineService } from '../../services/vaccine.service';

@Component({
  selector: 'app-vaccines',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    DateInputComponent,
    EmptyStateComponent,
    InputComponent,
    LoadingComponent,
    ModalComponent,
    ReactiveFormsModule,
    SearchComponent,
    SelectComponent,
    TableComponent,
    TextareaComponent
  ],
  template: `
    <div class="vaccines-page">
      <header class="vaccines-page__heading">
        <div>
          <span class="vaccines-page__eyebrow">Cuidados</span>
          <h1>Vacinas Aplicadas &amp; Próximas Doses</h1>
          <p>Consulte o histórico de imunização e acompanhe as próximas doses.</p>
        </div>
        <app-button type="button" (click)="openCreateModal()">Registrar Vacina</app-button>
      </header>

      <div class="vaccines-page__toolbar">
        <app-search
          id="vaccines-search"
          label="Buscar vacina ou pet"
          placeholder="Pesquisar vacina ou pet"
          [value]="vaccineService.search()"
          (valueChange)="onSearch($event)"
        />
        <app-select
          id="vaccines-pet-filter"
          label="Filtrar por pet"
          placeholder="Selecione um pet"
          [options]="petOptions()"
          [formControl]="petFilter"
        />
      </div>

      @if (errorMessage()) {
        <app-alert
          variant="error"
          title="Não foi possível carregar as vacinas"
          [message]="errorMessage()"
        />
      }

      @if (successMessage()) {
        <app-alert variant="success" title="Vacina registrada" [message]="successMessage()" />
      }

      @if (isBusy()) {
        <app-loading label="Carregando histórico de vacinas..." />
      } @else if (!errorMessage()) {
        <app-card title="Histórico de Imunização">
          @if (vaccineService.filteredItems().length === 0) {
            <app-empty-state
              [title]="emptyTitle"
              [message]="emptyMessage"
            />
          } @else {
            <app-table label="Histórico de imunização">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Vacina</th>
                  <th>Data de Aplicação</th>
                  <th>Próxima Dose</th>
                  <th>Observações</th>
                </tr>
              </thead>
              <tbody>
                @for (item of vaccineService.filteredItems(); track item.vaccine.id) {
                  <tr>
                    <td>{{ item.pet.name }}</td>
                    <td>{{ item.vaccine.name }}</td>
                    <td>{{ formatDate(item.vaccine.applicationDate) }}</td>
                    <td>{{ formatDate(item.vaccine.nextDoseDate) }}</td>
                    <td>{{ item.vaccine.notes || '—' }}</td>
                  </tr>
                }
              </tbody>
            </app-table>
          }
        </app-card>
      }

      <app-modal [open]="isCreateModalOpen()" title="Registrar vacina"
        description="Adicione uma vacina ao histórico de imunização do pet." (closed)="closeCreateModal()">
        <form class="vaccines-page__form" [formGroup]="createForm" (ngSubmit)="submitCreate()" modal-content>
          @if (createErrorMessage()) {
            <app-alert variant="error" title="Não foi possível registrar a vacina" [message]="createErrorMessage()" />
          }
          <app-select id="vaccine-pet" label="Pet" placeholder="Selecione o pet" [required]="true"
            [options]="createPetOptions()" [error]="createFieldError('petId')" formControlName="petId" />
          <app-input id="vaccine-name" label="Nome da vacina" placeholder="Ex.: Antirrábica" [required]="true"
            [error]="createFieldError('name')" formControlName="name" />
          <div class="vaccines-page__form-dates">
            <app-date-input id="vaccine-application-date" label="Data de aplicação" [required]="true"
              [error]="createFieldError('applicationDate')" formControlName="applicationDate" />
            <app-date-input id="vaccine-next-dose-date" label="Próxima dose" formControlName="nextDoseDate" />
          </div>
          <app-textarea id="vaccine-notes" label="Observações"
            placeholder="Adicione informações importantes, se necessário" formControlName="notes" />
        </form>
        <div class="vaccines-page__modal-actions" modal-footer>
          <app-button variant="secondary" type="button" [disabled]="isSubmitting()" (click)="closeCreateModal()">Cancelar</app-button>
          <app-button type="button" [loading]="isSubmitting()" (click)="submitCreate()">Salvar vacina</app-button>
        </div>
      </app-modal>
    </div>
  `,
  styleUrl: './vaccines.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VaccinesComponent implements OnInit {
  readonly vaccineService = inject(VaccineService);
  private readonly petService = inject(PetService);
  private readonly authService = inject(AuthService);

  readonly petFilter = new FormControl('all', { nonNullable: true });
  readonly errorMessage = signal('');
  readonly petOptions = signal<readonly { value: string; label: string }[]>([
    { value: 'all', label: 'Todos os pets' }
  ]);
  readonly pets = signal<readonly import('../../models/pet.model').Pet[]>([]);
  readonly isCreateModalOpen = signal(false);
  readonly isSubmitting = signal(false);
  readonly createErrorMessage = signal('');
  readonly successMessage = signal('');
  readonly createForm = new FormGroup({
    petId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    applicationDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nextDoseDate: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true })
  });
  readonly isBusy = computed(
    () => this.petService.isLoading() || this.vaccineService.isLoading()
  );

  get emptyTitle(): string {
    return this.hasActiveFilters
      ? 'Nenhuma vacina encontrada'
      : 'Nenhuma vacina registrada';
  }

  get emptyMessage(): string {
    return this.hasActiveFilters
      ? 'Ajuste a busca ou o filtro para visualizar outros registros.'
      : 'Registre a primeira vacina para acompanhar o histórico de imunização.';
  }

  private get hasActiveFilters(): boolean {
    return this.vaccineService.search().trim().length > 0 || this.vaccineService.petId() !== null;
  }

  ngOnInit(): void {
    this.petFilter.valueChanges.subscribe(value => {
      this.vaccineService.setPetId(value === 'all' ? null : Number(value));
    });

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
        this.vaccineService.listVaccines(userId, pets).subscribe({
          error: (error: unknown) => this.handleError(error)
        });
      },
      error: (error: unknown) => this.handleError(error, 'Não foi possível carregar os pets.')
    });
  }

  onSearch(value: string): void {
    this.vaccineService.setSearch(value);
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
    if (!this.isSubmitting()) this.isCreateModalOpen.set(false);
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
      this.createErrorMessage.set('Não foi possível identificar o pet para este registro.');
      return;
    }
    this.isSubmitting.set(true);
    this.vaccineService.createVaccine(userId, pet, {
      name: values.name,
      applicationDate: values.applicationDate,
      ...(values.nextDoseDate ? { nextDoseDate: values.nextDoseDate } : {}),
      ...(values.notes ? { notes: values.notes } : {})
    }).pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: () => {
        this.isCreateModalOpen.set(false);
        this.createForm.reset({ petId: '', name: '', applicationDate: '', nextDoseDate: '', notes: '' });
        this.successMessage.set('O histórico de imunização foi atualizado.');
      },
      error: (error: unknown) => this.createErrorMessage.set(
        error instanceof ApiHttpError ? error.message : 'Não foi possível registrar a vacina.'
      )
    });
  }

  createFieldError(field: 'petId' | 'name' | 'applicationDate'): string {
    const control = this.createForm.controls[field];
    return control.touched && control.hasError('required') ? 'Campo obrigatório.' : '';
  }

  formatDate(value?: string | null): string {
    if (!value) {
      return '—';
    }

    const [year, month, day] = value.split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  }

  private handleError(error: unknown, fallback = 'Não foi possível carregar as vacinas.'): void {
    this.errorMessage.set(error instanceof ApiHttpError ? error.message : fallback);
  }
}
