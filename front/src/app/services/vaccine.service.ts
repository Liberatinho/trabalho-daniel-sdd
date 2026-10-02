import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, forkJoin, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApiHttpError } from '../core/http/api-error';
import { VaccineListFilters } from '../models/filters.model';
import { Pet } from '../models/pet.model';
import {
  CreateVaccineRequest,
  Vaccine,
  VaccineListItem,
  UpdateVaccineRequest
} from '../models/vaccine.model';

@Injectable({ providedIn: 'root' })
export class VaccineService {
  readonly items = signal<readonly VaccineListItem[]>([]);
  readonly search = signal('');
  readonly petId = signal<number | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<ApiHttpError | Error | null>(null);

  readonly filteredItems = computed(() =>
    this.applyFilters(this.items(), {
      search: this.search(),
      petId: this.petId() ?? undefined
    })
  );

  constructor(private readonly http: HttpClient) {}

  listVaccines(
    userId: number,
    pets: readonly Pet[],
    filters: VaccineListFilters = {}
  ): Observable<readonly VaccineListItem[]> {
    this.search.set(filters.search ?? '');
    this.petId.set(filters.petId ?? null);

    const targetPets = this.resolvePets(pets, filters.petId);
    if (targetPets.length === 0) {
      this.items.set([]);
      this.error.set(null);
      return of([]);
    }

    return this.request(
      forkJoin(
        targetPets.map(pet =>
          this.http
            .get<Vaccine[]>(this.vaccinesUrl(userId, pet.id))
            .pipe(map(vaccines => vaccines.map(vaccine => ({ pet, vaccine }))))
        )
      ).pipe(map(groups => groups.flat())),
      items => this.items.set(items)
    );
  }

  createVaccine(
    userId: number,
    pet: Pet,
    request: CreateVaccineRequest
  ): Observable<Vaccine> {
    return this.request(
      this.http.post<Vaccine>(this.vaccinesUrl(userId, pet.id), request),
      vaccine => {
        this.items.update(items => [...items, { pet, vaccine }]);
      }
    );
  }

  updateVaccine(userId: number, item: VaccineListItem, request: UpdateVaccineRequest): Observable<Vaccine> {
    return this.request(
      this.http.put<Vaccine>(`${this.vaccinesUrl(userId, item.pet.id)}/${item.vaccine.id}`, request),
      vaccine => this.items.update(items => items.map(current =>
        current.pet.id === item.pet.id && current.vaccine.id === item.vaccine.id
          ? { pet: item.pet, vaccine } : current
      ))
    );
  }

  deleteVaccine(userId: number, item: VaccineListItem): Observable<void> {
    return this.request(
      this.http.delete<void>(`${this.vaccinesUrl(userId, item.pet.id)}/${item.vaccine.id}`),
      () => this.items.update(items => items.filter(current =>
        current.pet.id !== item.pet.id || current.vaccine.id !== item.vaccine.id
      ))
    );
  }

  setSearch(search: string): void {
    this.search.set(search);
  }

  setPetId(petId: number | null): void {
    this.petId.set(petId);
  }

  private vaccinesUrl(userId: number, petId: number): string {
    return `${environment.apiUrl}/api/users/${userId}/pets/${petId}/vaccines`;
  }

  private applyFilters(
    items: readonly VaccineListItem[],
    filters: VaccineListFilters
  ): readonly VaccineListItem[] {
    const search = filters.search?.trim().toLowerCase() ?? '';
    const petId = filters.petId;

    return items.filter(item => {
      const matchesPet = petId === undefined || item.pet.id === petId;
      const matchesSearch =
        search.length === 0 ||
        item.vaccine.name.toLowerCase().includes(search) ||
        item.pet.name.toLowerCase().includes(search);

      return matchesPet && matchesSearch;
    });
  }

  private resolvePets(pets: readonly Pet[], petId?: number): readonly Pet[] {
    if (petId === undefined) {
      return pets;
    }

    return pets.filter(pet => pet.id === petId);
  }

  private request<T>(
    request: Observable<T>,
    onSuccess: (value: T) => void
  ): Observable<T> {
    return defer(() => {
      this.isLoading.set(true);
      this.error.set(null);
      return request;
    }).pipe(
      tap(onSuccess),
      catchError((error: unknown) => {
        this.error.set(error instanceof Error ? error : new Error('Erro desconhecido.'));
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }
}
