import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {
  CreatePetRequest,
  Pet
} from '../models/pet.model';
import { ApiHttpError } from '../core/http/api-error';

@Injectable({ providedIn: 'root' })
export class PetService {
  readonly pets = signal<readonly Pet[]>([]);
  readonly selectedPet = signal<Pet | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<ApiHttpError | Error | null>(null);

  constructor(private readonly http: HttpClient) {}

  listPets(userId: number): Observable<readonly Pet[]> {
    return this.request(
      this.http.get<Pet[]>(this.petsUrl(userId)),
      pets => {
        this.pets.set(pets);
        this.keepSelection(pets);
      }
    );
  }

  createPet(userId: number, request: CreatePetRequest): Observable<Pet> {
    return this.request(
      this.http.post<Pet>(this.petsUrl(userId), request),
      pet => {
        this.pets.update(pets => [...pets, pet]);
        this.selectPet(pet);
      }
    );
  }

  selectPet(pet: Pet | null): void {
    this.selectedPet.set(pet);
  }

  private petsUrl(userId: number): string {
    return `${environment.apiUrl}/api/users/${userId}/pets`;
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

  private keepSelection(pets: readonly Pet[]): void {
    const current = this.selectedPet();
    if (!current) {
      this.selectedPet.set(pets[0] ?? null);
      return;
    }

    this.selectedPet.set(pets.find(pet => pet.id === current.id) ?? pets[0] ?? null);
  }
}
