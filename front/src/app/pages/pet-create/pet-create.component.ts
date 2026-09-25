import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { DateInputComponent } from '../../components/ui/date-input/date-input.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { TextareaComponent } from '../../components/ui/textarea/textarea.component';
import { ApiHttpError } from '../../core/http/api-error';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';
import { CreatePetRequest } from '../../models/pet.model';

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    DateInputComponent,
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
    TextareaComponent
  ],
  template: `
    <div class="pet-create">
      <header class="pet-create__heading">
        <div>
          <span class="pet-create__eyebrow">Meus pets</span>
          <h1>Cadastrar novo pet</h1>
          <p>Registre as informações básicas para acompanhar os cuidados.</p>
        </div>
      </header>

      @if (errorMessage) {
        <app-alert
          variant="error"
          title="Não foi possível salvar o cadastro"
          [message]="errorMessage"
        />
      }

      @if (successMessage) {
        <app-alert variant="success" title="Cadastro salvo" [message]="successMessage" />
      }

      <app-card>
        <form class="pet-create__form" [formGroup]="form" (ngSubmit)="submit()">
          <div class="pet-create__fields">
            <app-input
              id="pet-name"
              label="Nome"
              placeholder="Nome do pet"
              [required]="true"
              [error]="fieldError('name')"
              formControlName="name"
            />
            <app-input
              id="pet-species"
              label="Espécie"
              placeholder="Informe a espécie"
              [required]="true"
              [error]="fieldError('species')"
              formControlName="species"
            />
            <app-input
              id="pet-breed"
              label="Raça"
              placeholder="Informe a raça, se aplicável"
              formControlName="breed"
            />
            <app-date-input
              id="pet-birth-date"
              label="Data de nascimento"
              formControlName="birthDate"
            />
          </div>
          <app-textarea
            id="pet-notes"
            label="Observações"
            placeholder="Adicione informações importantes, se necessário"
            formControlName="notes"
          />

          <div class="pet-create__actions">
            <app-button variant="secondary" routerLink="/pets">Cancelar</app-button>
            <app-button type="submit" [loading]="isSubmitting">Salvar cadastro</app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styleUrl: './pet-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetCreateComponent {
  private readonly authService = inject(AuthService);
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    species: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    breed: new FormControl('', { nonNullable: true }),
    birthDate: new FormControl('', { nonNullable: true }),
    notes: new FormControl('', { nonNullable: true })
  });

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.authService.currentUser()?.id;
    if (userId === undefined) {
      this.errorMessage = 'Nenhum usuário autenticado está disponível.';
      return;
    }

    this.isSubmitting = true;
    const values = this.form.getRawValue();
    const request: CreatePetRequest = {
      name: values.name,
      species: values.species,
      ...(values.breed ? { breed: values.breed } : {}),
      ...(values.birthDate ? { birthDate: values.birthDate } : {}),
      ...(values.notes ? { notes: values.notes } : {})
    };

    this.petService
      .createPet(userId, request)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          void this.router.navigate(['/pets'], {
            queryParams: { created: 'true' }
          });
        },
        error: (error: unknown) => {
          this.errorMessage =
            error instanceof ApiHttpError
              ? error.message
              : 'Não foi possível salvar o cadastro.';
        }
      });
  }

  fieldError(field: 'name' | 'species'): string {
    const control = this.form.controls[field];
    return control.touched && control.hasError('required')
      ? 'Campo obrigatório.'
      : '';
  }
}
