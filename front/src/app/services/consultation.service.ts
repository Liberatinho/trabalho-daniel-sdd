import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, defer, forkJoin, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApiHttpError } from '../core/http/api-error';
import { Consultation, ConsultationListItem, CreateConsultationRequest, UpdateConsultationRequest } from '../models/consultation.model';
import { ConsultationFilters } from '../models/filters.model';
import { Pet } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  readonly items = signal<readonly ConsultationListItem[]>([]);
  readonly search = signal('');
  readonly petId = signal<number | null>(null);
  readonly status = signal<ConsultationFilters['status'] | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<ApiHttpError | Error | null>(null);

  readonly filteredItems = computed(() => this.applyFilters(this.items()));

  constructor(private readonly http: HttpClient) {}

  listConsultations(
    userId: number,
    pets: readonly Pet[],
    filters: ConsultationFilters = {}
  ): Observable<readonly ConsultationListItem[]> {
    this.search.set(filters.search ?? '');
    this.petId.set(filters.petId ?? null);
    this.status.set(filters.status ?? null);
    const targetPets = filters.petId === undefined ? pets : pets.filter(pet => pet.id === filters.petId);
    if (targetPets.length === 0) {
      this.items.set([]);
      this.error.set(null);
      return of([]);
    }

    return this.request(
      forkJoin(targetPets.map(pet => this.http.get<Consultation[]>(this.url(userId, pet.id), {
        params: filters.status ? new HttpParams().set('status', filters.status) : undefined
      }).pipe(map(consultations => consultations.map(consultation => ({ pet, consultation })))))
      ).pipe(
        map(groups => groups.flat())
      ),
      items => this.items.set(items)
    );
  }

  createConsultation(userId: number, pet: Pet, request: CreateConsultationRequest): Observable<Consultation> {
    return this.request(this.http.post<Consultation>(this.url(userId, pet.id), request), consultation => {
      this.items.update(items => [...items, { pet, consultation }]);
    });
  }

  updateConsultation(userId: number, item: ConsultationListItem, request: UpdateConsultationRequest): Observable<Consultation> {
    return this.request(this.http.put<Consultation>(`${this.url(userId, item.pet.id)}/${item.consultation.id}`, request), consultation => {
      this.items.update(items => items.map(current =>
        current.pet.id === item.pet.id && current.consultation.id === item.consultation.id
          ? { pet: item.pet, consultation } : current
      ));
    });
  }

  deleteConsultation(userId: number, item: ConsultationListItem): Observable<void> {
    return this.request(this.http.delete<void>(`${this.url(userId, item.pet.id)}/${item.consultation.id}`), () => {
      this.items.update(items => items.filter(current =>
        current.pet.id !== item.pet.id || current.consultation.id !== item.consultation.id
      ));
    });
  }

  setSearch(search: string): void { this.search.set(search); }
  setPetId(petId: number | null): void { this.petId.set(petId); }
  setStatus(status: ConsultationFilters['status'] | null): void { this.status.set(status); }

  private url(userId: number, petId: number): string {
    return `${environment.apiUrl}/api/users/${userId}/pets/${petId}/consultations`;
  }

  private applyFilters(items: readonly ConsultationListItem[]): readonly ConsultationListItem[] {
    const search = this.search().trim().toLowerCase();
    return items.filter(({ pet, consultation }) =>
      (this.petId() === null || pet.id === this.petId()) &&
      (this.status() === null || consultation.status === this.status()) &&
      (!search || [pet.name, consultation.veterinarian, consultation.reason]
        .some(value => value.toLowerCase().includes(search)))
    );
  }

  private request<T>(request: Observable<T>, onSuccess: (value: T) => void): Observable<T> {
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
