import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { PetCreateComponent } from './pet-create.component';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';

@Component({
  standalone: true,
  template: ''
})
class TestRouteComponent {}

describe('PetCreateComponent', () => {
  it('does not submit an invalid form', () => {
    const petService = {
      isLoading: signal(false),
      pets: signal([]),
      selectedPet: signal(null),
      createPet: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [PetCreateComponent],
      providers: [
        provideRouter([{ path: 'pets', component: TestRouteComponent }]),
        {
          provide: AuthService,
          useValue: { currentUser: signal({ id: 7, name: 'Maria', email: 'maria@example.com' }) }
        },
        { provide: PetService, useValue: petService }
      ]
    });

    const fixture = TestBed.createComponent(PetCreateComponent);
    fixture.componentInstance.submit();

    expect(petService.createPet).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.controls.name.touched).toBe(true);
  });

  it('submits the backend pet contract and completes successfully', () => {
    const petService = {
      isLoading: signal(false),
      pets: signal([]),
      selectedPet: signal(null),
      createPet: vi.fn().mockReturnValue(
        of({ id: 8, name: 'Luna', species: 'Gato' })
      )
    };

    TestBed.configureTestingModule({
      imports: [PetCreateComponent],
      providers: [
        provideRouter([{ path: 'pets', component: TestRouteComponent }]),
        {
          provide: AuthService,
          useValue: { currentUser: signal({ id: 7, name: 'Maria', email: 'maria@example.com' }) }
        },
        { provide: PetService, useValue: petService }
      ]
    });

    const fixture = TestBed.createComponent(PetCreateComponent);
    fixture.componentInstance.form.setValue({
      name: 'Luna',
      species: 'Gato',
      breed: '',
      birthDate: '',
      notes: ''
    });
    fixture.componentInstance.submit();

    expect(petService.createPet).toHaveBeenCalledWith(7, {
      name: 'Luna',
      species: 'Gato'
    });
  });
});
