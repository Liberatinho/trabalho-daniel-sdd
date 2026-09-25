import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { LoadingComponent } from '../../components/ui/loading/loading.component';
import { SearchComponent } from '../../components/ui/search/search.component';
import { SelectComponent } from '../../components/ui/select/select.component';
import { TableComponent } from '../../components/ui/table/table.component';
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
    EmptyStateComponent,
    LoadingComponent,
    ReactiveFormsModule,
    SearchComponent,
    SelectComponent,
    TableComponent
  ],
  template: `
    <div class="vaccines-page">
      <header class="vaccines-page__heading">
        <div>
          <span class="vaccines-page__eyebrow">Cuidados</span>
          <h1>Vacinas Aplicadas &amp; Próximas Doses</h1>
          <p>Consulte o histórico de imunização e acompanhe as próximas doses.</p>
        </div>
        <app-button type="button">Registrar Vacina</app-button>
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
