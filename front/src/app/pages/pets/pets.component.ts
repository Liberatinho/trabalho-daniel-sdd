import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { EmptyStateComponent } from '../../components/ui/empty-state/empty-state.component';
import { LoadingComponent } from '../../components/ui/loading/loading.component';
import { AvatarComponent } from '../../components/ui/avatar/avatar.component';
import { ApiHttpError } from '../../core/http/api-error';
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
    EmptyStateComponent,
    LoadingComponent,
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
            <button
              class="pet-card"
              type="button"
              [class.pet-card--selected]="petService.selectedPet()?.id === pet.id"
              [attr.aria-pressed]="petService.selectedPet()?.id === pet.id"
              (click)="selectPet(pet)"
            >
              <app-avatar [name]="pet.name" [label]="'Selecionar ' + pet.name" />
              <span class="pet-card__copy">
                <strong>{{ pet.name }}</strong>
                <span>{{ pet.species }}{{ pet.breed ? ' · ' + pet.breed : '' }}</span>
                @if (pet.birthDate) {
                  <small>Nascimento: {{ pet.birthDate }}</small>
                }
              </span>
              @if (petService.selectedPet()?.id === pet.id) {
                <span class="pet-card__selected">Selecionado</span>
              }
            </button>
          }
        </section>
      }
    </div>
  `,
  styleUrl: './pets.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetsComponent implements OnInit {
  readonly petService = inject(PetService);
  private readonly authService = inject(AuthService);

  errorMessage = '';

  ngOnInit(): void {
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
}
