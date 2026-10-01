import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Pet } from '../models/pet.model';
import { VaccineService } from './vaccine.service';

const luna: Pet = { id: 1, name: 'Luna', species: 'Gato' };
const rex: Pet = { id: 2, name: 'Rex', species: 'Cão' };

describe('VaccineService', () => {
  let service: VaccineService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VaccineService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(VaccineService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('lists vaccines for every pet when no pet filter is applied', () => {
    service.listVaccines(7, [luna, rex]).subscribe();

    const lunaRequest = http.expectOne(
      'http://localhost:8080/api/users/7/pets/1/vaccines'
    );
    const rexRequest = http.expectOne(
      'http://localhost:8080/api/users/7/pets/2/vaccines'
    );

    expect(lunaRequest.request.method).toBe('GET');
    lunaRequest.flush([
      { id: 10, name: 'Antirrábica', applicationDate: '2026-01-10' }
    ]);
    rexRequest.flush([]);

    expect(service.items()).toEqual([
      {
        pet: luna,
        vaccine: { id: 10, name: 'Antirrábica', applicationDate: '2026-01-10' }
      }
    ]);
    expect(service.isLoading()).toBe(false);
  });

  it('lists vaccines only for the filtered pet', () => {
    service.listVaccines(7, [luna, rex], { petId: 2 }).subscribe();

    http.expectOne('http://localhost:8080/api/users/7/pets/2/vaccines').flush([
      { id: 11, name: 'V10', applicationDate: '2026-02-01' }
    ]);
    http.expectNone('http://localhost:8080/api/users/7/pets/1/vaccines');

    expect(service.items()).toHaveLength(1);
    expect(service.items()[0].pet.id).toBe(2);
  });

  it('filters listed vaccines by vaccine or pet name', () => {
    service.items.set([
      {
        pet: luna,
        vaccine: { id: 10, name: 'Antirrábica', applicationDate: '2026-01-10' }
      },
      {
        pet: rex,
        vaccine: { id: 11, name: 'V10', applicationDate: '2026-02-01' }
      }
    ]);

    service.setSearch('luna');
    expect(service.filteredItems()).toHaveLength(1);
    expect(service.filteredItems()[0].pet.name).toBe('Luna');

    service.setSearch('v10');
    expect(service.filteredItems()[0].vaccine.name).toBe('V10');
  });

  it('creates a vaccine using the nested pet endpoint and updates the list', () => {
    service
      .createVaccine(7, luna, {
        name: 'Antirrábica',
        applicationDate: '2026-03-01',
        notes: 'Dose anual'
      })
      .subscribe();

    const request = http.expectOne(
      'http://localhost:8080/api/users/7/pets/1/vaccines'
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Antirrábica',
      applicationDate: '2026-03-01',
      notes: 'Dose anual'
    });

    request.flush({
      id: 20,
      name: 'Antirrábica',
      applicationDate: '2026-03-01',
      notes: 'Dose anual'
    });

    expect(service.items()).toEqual([
      {
        pet: luna,
        vaccine: {
          id: 20,
          name: 'Antirrábica',
          applicationDate: '2026-03-01',
          notes: 'Dose anual'
        }
      }
    ]);
  });

  it('returns an empty list when there are no pets', () => {
    let result: unknown;
    service.listVaccines(7, []).subscribe(items => {
      result = items;
    });

    expect(result).toEqual([]);
    expect(service.items()).toEqual([]);
    http.expectNone(() => true);
  });

  it('exposes HTTP errors and keeps loading false', () => {
    service.listVaccines(7, [luna]).subscribe({ error: () => undefined });

    http
      .expectOne('http://localhost:8080/api/users/7/pets/1/vaccines')
      .flush(
        { status: 500, message: 'Falha no servidor' },
        { status: 500, statusText: 'Server Error' }
      );

    expect(service.error()).toBeInstanceOf(Error);
    expect(service.isLoading()).toBe(false);
  });
});
