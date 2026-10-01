import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, of, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { ApiHttpError } from '../core/http/api-error';
import { environment } from '../../environments/environment';
import {
  CreateUserRequest,
  LoginRequest,
  User
} from '../models/user.model';

interface UserWithPassword extends User {
  readonly password: string;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('E-mail ou senha inválidos.');
    this.name = 'InvalidCredentialsError';
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<Error | null>(null);

  constructor(private readonly http: HttpClient) {}

  register(request: CreateUserRequest): Observable<User> {
    return defer(() => {
      this.isLoading.set(true);
      this.error.set(null);
      return this.http
        .post<User>(`${environment.apiUrl}/api/users`, request)
        .pipe(map((user) => toPublicUser(user)));
    }).pipe(
      tap(() => this.error.set(null)),
      finalize(() => this.isLoading.set(false))
    );
  }

  login(request: LoginRequest): Observable<User> {
    return defer(() => {
      this.isLoading.set(true);
      this.error.set(null);
      return this.http
        .get<UserWithPassword>(
          `${environment.apiUrl}/api/users/email/${encodeURIComponent(request.email)}`
        )
        .pipe(
          catchError((error: unknown) => {
            if (error instanceof ApiHttpError && error.status === 404) {
              return throwError(() => new InvalidCredentialsError());
            }
            return throwError(() => error);
          }),
          map((user) => {
            if (user.password !== request.password) {
              throw new InvalidCredentialsError();
            }
            return toPublicUser(user);
          }),
          tap((user) => this.currentUser.set(user))
        );
    }).pipe(
      tap(() => this.error.set(null)),
      catchError((error: unknown) => {
        this.error.set(
          error instanceof Error ? error : new Error('Falha no login.')
        );
        return throwError(() => error);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  restoreSession(): Observable<User | null> {
    this.error.set(null);
    return of(this.currentUser());
  }

  logout(): Observable<void> {
    this.error.set(null);
    this.currentUser.set(null);
    return of(undefined);
  }
}

function toPublicUser(user: User): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
