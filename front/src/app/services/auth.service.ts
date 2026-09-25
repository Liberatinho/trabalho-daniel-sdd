import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, of, throwError } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {
  CreateUserRequest,
  LoginRequest,
  User
} from '../models/user.model';

export class AuthenticationUnavailableError extends Error {
  constructor() {
    super('O backend ainda não disponibiliza autenticação.');
    this.name = 'AuthenticationUnavailableError';
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
      return this.http.post<User>(`${environment.apiUrl}/api/users`, request);
    }).pipe(
      tap(() => this.error.set(null)),
      finalize(() => this.isLoading.set(false))
    );
  }

  login(_request: LoginRequest): Observable<never> {
    const error = new AuthenticationUnavailableError();
    this.error.set(error);
    return throwError(() => error);
  }

  restoreSession(): Observable<User | null> {
    this.currentUser.set(null);
    this.error.set(null);
    return of(null);
  }

  logout(): void {
    this.currentUser.set(null);
    this.error.set(null);
  }
}
