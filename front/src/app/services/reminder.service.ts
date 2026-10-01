import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, defer, forkJoin, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ApiHttpError } from '../core/http/api-error';
import { ReminderFilters } from '../models/filters.model';
import { Pet } from '../models/pet.model';
import {
  CreateReminderRequest,
  Reminder,
  ReminderListItem,
  ReminderType
} from '../models/reminder.model';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  readonly items = signal<readonly ReminderListItem[]>([]);
  readonly search = signal('');
  readonly petId = signal<number | null>(null);
  readonly type = signal<ReminderType | null>(null);
  readonly completed = signal<boolean | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<ApiHttpError | Error | null>(null);

  readonly filteredItems = computed(() => this.applyFilters(this.items()));

  constructor(private readonly http: HttpClient) {}

  listReminders(
    userId: number,
    pets: readonly Pet[],
    filters: ReminderFilters = {}
  ): Observable<readonly ReminderListItem[]> {
    this.search.set(filters.search ?? '');
    this.petId.set(filters.petId ?? null);
    this.type.set(filters.type ?? null);
    this.completed.set(filters.completed ?? null);

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
            .get<Reminder[]>(this.remindersUrl(userId, pet.id), {
              params: this.toHttpParams(filters)
            })
            .pipe(map(reminders => reminders.map(reminder => ({ pet, reminder }))))
        )
      ).pipe(map(groups => groups.flat())),
      items => this.items.set(items)
    );
  }

  createReminder(
    userId: number,
    pet: Pet,
    request: CreateReminderRequest
  ): Observable<Reminder> {
    return this.request(
      this.http.post<Reminder>(this.remindersUrl(userId, pet.id), request),
      reminder => this.items.update(items => [...items, { pet, reminder }])
    );
  }

  setSearch(search: string): void {
    this.search.set(search);
  }

  setPetId(petId: number | null): void {
    this.petId.set(petId);
  }

  setType(type: ReminderType | null): void {
    this.type.set(type);
  }

  setCompleted(completed: boolean | null): void {
    this.completed.set(completed);
  }

  private remindersUrl(userId: number, petId: number): string {
    return `${environment.apiUrl}/api/users/${userId}/pets/${petId}/reminders`;
  }

  private toHttpParams(filters: ReminderFilters): HttpParams | undefined {
    let params = new HttpParams();
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.completed !== undefined) {
      params = params.set('completed', String(filters.completed));
    }
    return params.keys().length > 0 ? params : undefined;
  }

  private resolvePets(pets: readonly Pet[], petId?: number): readonly Pet[] {
    return petId === undefined ? pets : pets.filter(pet => pet.id === petId);
  }

  private applyFilters(items: readonly ReminderListItem[]): readonly ReminderListItem[] {
    const search = this.search().trim().toLowerCase();
    return items.filter(({ pet, reminder }) =>
      (this.petId() === null || pet.id === this.petId()) &&
      (this.type() === null || reminder.type === this.type()) &&
      (this.completed() === null || reminder.completed === this.completed()) &&
      (!search || [pet.name, reminder.description].some(value => value.toLowerCase().includes(search)))
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
