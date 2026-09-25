import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PetService } from './pet.service';

describe('PetService', () => {
  let service: PetService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PetService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PetService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('lists pets and selects the first pet when there is no selection', () => {
    service.listPets(7).subscribe();

    const request = http.expectOne('http://localhost:8080/api/users/7/pets');
    expect(request.request.method).toBe('GET');

    request.flush([
      { id: 1, name: 'Luna', species: 'Gato' },
      { id: 2, name: 'Rex', species: 'Cão' }
    ]);

    expect(service.pets()).toHaveLength(2);
    expect(service.selectedPet()?.id).toBe(1);
    expect(service.isLoading()).toBe(false);
  });

  it('represents an empty response without selecting a pet', () => {
    service.listPets(7).subscribe();
    http.expectOne('http://localhost:8080/api/users/7/pets').flush([]);

    expect(service.pets()).toEqual([]);
    expect(service.selectedPet()).toBeNull();
  });

  it('creates a pet and updates the list and selection', () => {
    service.createPet(7, {
      name: 'Mimi',
      species: 'Gato',
      breed: 'SRD'
    }).subscribe();

    const request = http.expectOne('http://localhost:8080/api/users/7/pets');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Mimi',
      species: 'Gato',
      breed: 'SRD'
    });

    request.flush({ id: 3, name: 'Mimi', species: 'Gato', breed: 'SRD' });

    expect(service.pets()).toEqual([
      { id: 3, name: 'Mimi', species: 'Gato', breed: 'SRD' }
    ]);
    expect(service.selectedPet()?.id).toBe(3);
  });

  it('exposes HTTP errors and keeps loading false', () => {
    service.listPets(7).subscribe({
      error: () => undefined
    });

    const request = http.expectOne('http://localhost:8080/api/users/7/pets');
    request.flush(
      { status: 500, message: 'Falha no servidor' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(service.error()).toBeInstanceOf(Error);
    expect(service.isLoading()).toBe(false);
  });

  it('allows selecting a specific pet', () => {
    const pet = { id: 4, name: 'Thor', species: 'Cão' };
    service.selectPet(pet);

    expect(service.selectedPet()).toEqual(pet);
  });
});
