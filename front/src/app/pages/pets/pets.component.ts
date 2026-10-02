import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { ConfirmDeleteComponent } from '../../components/ui/confirm-delete/confirm-delete.component';
import { DateInputComponent } from '../../components/ui/date-input/date-input.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { LoadingComponent } from '../../components/ui/loading/loading.component';
import { AvatarComponent } from '../../components/ui/avatar/avatar.component';
import { ModalComponent } from '../../components/ui/modal/modal.component';
import { TextareaComponent } from '../../components/ui/textarea/textarea.component';
import { ApiHttpError } from '../../core/http/api-error';
import { Pet, UpdatePetRequest } from '../../models/pet.model';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    AlertComponent,
    AvatarComponent,
    ButtonComponent,
    CardComponent,
    ConfirmDeleteComponent,
    DateInputComponent,
    EmptyStateComponent,
    InputComponent,
    LoadingComponent,
    ModalComponent,
    ReactiveFormsModule,
    TextareaComponent,
    RouterLink
  ],
  template: `
    <div class="pets-page">
      <header class="pets-page__heading">
        <div>
          <span class="pets-page__eyebrow">Minha rotina</span>
          <h1>Meus pets</h1>
          <p>Consulte e organize as informações dos seus companheiros.</p>
        </div>
        <app-button routerLink="/pets/new">Cadastrar novo pet</app-button>
      </header>

      @if (errorMessage) {
        <app-alert variant="error" title="Não foi possível carregar os pets" [message]="errorMessage" />
      }
      @if (successMessage) {
        <app-alert variant="success" title="Operação concluída" [message]="successMessage" />
      }

      @if (petService.isLoading()) {
        <app-loading label="Carregando seus pets..." />
      } @else if (!errorMessage && petService.pets().length === 0) {
        <app-card>
          <app-empty-state
            title="Você ainda não cadastrou pets"
            message="Cadastre o primeiro pet para acompanhar os cuidados dele."
          >
            <app-button routerLink="/pets/new">Cadastrar pet</app-button>
          </app-empty-state>
        </app-card>
      } @else if (!errorMessage) {
        <section class="pets-page__grid" aria-label="Pets cadastrados">
          @for (pet of petService.pets(); track pet.id) {
            <article
              class="pet-card"
              [class.pet-card--selected]="petService.selectedPet()?.id === pet.id"
            >
              <button class="pet-card__select" type="button"
                [attr.aria-pressed]="petService.selectedPet()?.id === pet.id"
                (click)="selectPet(pet)">
                <app-avatar [name]="pet.name" [label]="'Selecionar ' + pet.name" />
                <span class="pet-card__copy">
                  <strong>{{ pet.name }}</strong>
                  <span>{{ pet.species }}{{ pet.breed ? ' · ' + pet.breed : '' }}</span>
                  @if (pet.birthDate) { <small>Nascimento: {{ formatDate(pet.birthDate) }}</small> }
                </span>
                @if (petService.selectedPet()?.id === pet.id) {
                  <span class="pet-card__selected">Selecionado</span>
                }
              </button>
              <div class="record-actions pet-card__actions">
                <button class="record-action" type="button" (click)="openEdit(pet)" [attr.aria-label]="'Editar ' + pet.name">Editar</button>
                <button class="record-action record-action--danger" type="button" (click)="openDelete(pet)" [attr.aria-label]="'Excluir ' + pet.name">Excluir</button>
              </div>
            </article>
          }
        </section>
      }

      <app-modal [open]="editingPet() !== null" title="Editar pet"
        description="Atualize os dados do seu pet." (closed)="closeEdit()">
        <form class="pets-page__form" [formGroup]="editForm" (ngSubmit)="submitEdit()" modal-content>
          @if (editError()) { <app-alert variant="error" title="Não foi possível salvar" [message]="editError()" /> }
          <app-input id="pet-edit-name" label="Nome" [required]="true" [error]="fieldError('name')" formControlName="name" />
          <app-input id="pet-edit-species" label="Espécie" [required]="true" [error]="fieldError('species')" formControlName="species" />
          <app-input id="pet-edit-breed" label="Raça" formControlName="breed" />
          <app-date-input id="pet-edit-birth-date" label="Data de nascimento" formControlName="birthDate" />
          <app-textarea id="pet-edit-notes" label="Observações" formControlName="notes" />
        </form>
        <div class="pets-page__modal-actions" modal-footer>
          <app-button variant="secondary" type="button" [disabled]="isSubmitting()" (click)="closeEdit()">Cancelar</app-button>
          <app-button type="button" [loading]="isSubmitting()" (click)="submitEdit()">Salvar alterações</app-button>
        </div>
      </app-modal>

      <app-confirm-delete [open]="deletingPet() !== null" title="Excluir pet?"
        [message]="'Excluir ' + (deletingPet()?.name ?? 'este pet') + ' também removerá suas vacinas, consultas e lembretes.'"
        [error]="deleteError()" [loading]="isDeleting()"
        (canceled)="closeDelete()" (confirmed)="confirmDelete()" />
    </div>
  `,
  styleUrl: './pets.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetsComponent implements OnInit {
  readonly petService = inject(PetService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  errorMessage = '';
  successMessage = '';
  readonly editingPet = signal<Pet | null>(null);
  readonly deletingPet = signal<Pet | null>(null);
  readonly editError = signal('');
  readonly deleteError = signal('');
  readonly isSubmitting = signal(false);
  readonly isDeleting = signal(false);
  readonly editForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    species: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    breed: new FormControl('', { nonNullable: true }),
    birthDate: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true })
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('created') === 'true') {
      this.successMessage = 'O novo pet foi cadastrado com sucesso.';
    }

    const userId = this.authService.currentUser()?.id;
    if (userId === undefined) {
      this.errorMessage = 'Nenhum usuário autenticado está disponível.';
      return;
    }

    this.petService.listPets(userId).subscribe({
      error: (error: unknown) => {
        this.errorMessage =
          error instanceof ApiHttpError
            ? error.message
            : 'Não foi possível carregar os pets.';
      }
    });
  }

  selectPet(pet: Parameters<PetService['selectPet']>[0]): void {
    this.petService.selectPet(pet);
  }

  openEdit(pet: Pet): void {
    this.editError.set('');
    this.successMessage = '';
    this.editForm.reset({ name: pet.name, species: pet.species, breed: pet.breed ?? '', birthDate: pet.birthDate ?? '', notes: pet.notes ?? '' });
    this.editingPet.set(pet);
  }

  closeEdit(): void {
    if (!this.isSubmitting()) this.editingPet.set(null);
  }

  submitEdit(): void {
    this.editError.set('');
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const pet = this.editingPet();
    const userId = this.authService.currentUser()?.id;
    if (!pet || userId === undefined) return;
    const values = this.editForm.getRawValue();
    const request: UpdatePetRequest = {
      name: values.name.trim(),
      species: values.species.trim(),
      ...(values.breed.trim() ? { breed: values.breed.trim() } : {}),
      ...(values.birthDate ? { birthDate: values.birthDate } : {}),
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {})
    };
    this.isSubmitting.set(true);
    this.petService.updatePet(userId, pet.id, request).pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: () => {
        this.editingPet.set(null);
        this.successMessage = 'Os dados do pet foram atualizados.';
      },
      error: error => this.editError.set(error instanceof ApiHttpError ? error.message : 'Não foi possível atualizar o pet.')
    });
  }

  openDelete(pet: Pet): void {
    this.deleteError.set('');
    this.successMessage = '';
    this.deletingPet.set(pet);
  }

  closeDelete(): void {
    if (!this.isDeleting()) this.deletingPet.set(null);
  }

  confirmDelete(): void {
    const pet = this.deletingPet();
    const userId = this.authService.currentUser()?.id;
    if (!pet || userId === undefined) return;
    this.isDeleting.set(true);
    this.petService.deletePet(userId, pet.id).pipe(finalize(() => this.isDeleting.set(false))).subscribe({
      next: () => {
        this.deletingPet.set(null);
        this.successMessage = `${pet.name} foi excluído.`;
      },
      error: error => this.deleteError.set(error instanceof ApiHttpError ? error.message : 'Não foi possível excluir o pet.')
    });
  }

  fieldError(field: 'name' | 'species'): string {
    const control = this.editForm.controls[field];
    return control.touched && control.hasError('required') ? 'Campo obrigatório.' : '';
  }

  formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  }
}
