import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { apiErrorInterceptor } from '../core/http/api-error.interceptor';
import { User } from '../models/user.model';
import { AuthService, InvalidCredentialsError } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('checks credentials using the existing email lookup and keeps only public user data', () => {
    let loggedInUser: User | undefined;
    service.login({ email: 'tutor@example.com', password: 'secret' }).subscribe((user) => {
      loggedInUser = user;
    });

    const request = http.expectOne(
      'http://localhost:8080/api/users/email/tutor%40example.com'
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      id: 3,
      name: 'Tutor',
      email: 'tutor@example.com',
      password: 'secret',
      pets: []
    });

    expect(loggedInUser).toEqual({
      id: 3,
      name: 'Tutor',
      email: 'tutor@example.com'
    });
    expect(service.currentUser()).toEqual(loggedInUser);
  });

  it('rejects a wrong password without storing user data', () => {
    let loginError: unknown;
    service.login({ email: 'tutor@example.com', password: 'wrong' }).subscribe({
      error: (error: unknown) => {
        loginError = error;
      }
    });

    http
      .expectOne('http://localhost:8080/api/users/email/tutor%40example.com')
      .flush({
        id: 3,
        name: 'Tutor',
        email: 'tutor@example.com',
        password: 'secret'
      });

    expect(loginError).toBeInstanceOf(InvalidCredentialsError);
    expect(service.currentUser()).toBeNull();
  });

  it('treats an unknown email as invalid credentials', () => {
    let loginError: unknown;
    service.login({ email: 'missing@example.com', password: 'secret' }).subscribe({
      error: (error: unknown) => {
        loginError = error;
      }
    });

    http
      .expectOne('http://localhost:8080/api/users/email/missing%40example.com')
      .flush(
        { status: 404, message: 'Usuário não encontrado' },
        { status: 404, statusText: 'Not Found' }
      );

    expect(loginError).toBeInstanceOf(InvalidCredentialsError);
  });

  it('keeps the session in memory and clears it on logout', () => {
    service.currentUser.set({ id: 3, name: 'Tutor', email: 'tutor@example.com' });
    service.restoreSession().subscribe((user) => {
      expect(user?.id).toBe(3);
    });
    expect(http.match(() => true)).toHaveLength(0);

    service.logout().subscribe();
    expect(service.currentUser()).toBeNull();
    expect(http.match(() => true)).toHaveLength(0);
  });
});
