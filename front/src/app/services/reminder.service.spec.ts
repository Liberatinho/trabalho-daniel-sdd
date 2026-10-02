import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Pet } from '../models/pet.model';
import { ReminderType } from '../models/reminder.model';
import { ReminderService } from './reminder.service';

const luna: Pet = { id: 1, name: 'Luna', species: 'Gato' };
const rex: Pet = { id: 2, name: 'Rex', species: 'Cão' };

describe('ReminderService', () => {
  let service: ReminderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReminderService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ReminderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists reminders for every pet and applies backend filters', () => {
    service.listReminders(7, [luna, rex], {
      type: ReminderType.Vaccine,
      completed: false
    }).subscribe();

    const lunaRequest = http.expectOne(request =>
      request.url === 'http://localhost:8080/api/users/7/pets/1/reminders' &&
      request.params.get('type') === ReminderType.Vaccine &&
      request.params.get('completed') === 'false'
    );
    const rexRequest = http.expectOne(request =>
      request.url === 'http://localhost:8080/api/users/7/pets/2/reminders' &&
      request.params.get('type') === ReminderType.Vaccine &&
      request.params.get('completed') === 'false'
    );
    lunaRequest.flush([{ id: 10, type: 'VACCINE', description: 'Reforço', dueDate: '2026-07-10', completed: false }]);
    rexRequest.flush([]);

    expect(service.items()).toEqual([{ pet: luna, reminder: expect.objectContaining({ id: 10 }) }]);
  });

  it('filters loaded reminders by category, pet, completion status and search', () => {
    service.items.set([
      { pet: luna, reminder: { id: 10, type: ReminderType.Vaccine, description: 'Reforço da V10', dueDate: '2026-07-10', completed: false } },
      { pet: rex, reminder: { id: 11, type: ReminderType.Medication, description: 'Vermífugo', dueDate: '2026-08-01', completed: true } }
    ]);

    service.setType(ReminderType.Vaccine);
    expect(service.filteredItems()).toHaveLength(1);
    service.setType(null);
    service.setPetId(rex.id);
    service.setCompleted(true);
    service.setSearch('vermífugo');

    expect(service.filteredItems()).toEqual([expect.objectContaining({ pet: rex })]);
  });

  it('creates a reminder with the backend contract and updates the list without reload', () => {
    service.createReminder(7, luna, {
      type: ReminderType.Consultation,
      description: 'Retorno anual',
      dueDate: '2026-09-01'
    }).subscribe();

    const request = http.expectOne('http://localhost:8080/api/users/7/pets/1/reminders');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      type: ReminderType.Consultation,
      description: 'Retorno anual',
      dueDate: '2026-09-01'
    });
    request.flush({ id: 12, type: 'CONSULTATION', description: 'Retorno anual', dueDate: '2026-09-01', completed: false });

    expect(service.items()).toEqual([expect.objectContaining({ pet: luna })]);
  });

  it('exposes HTTP errors and ends loading', () => {
    service.listReminders(7, [luna]).subscribe({ error: () => undefined });
    http.expectOne('http://localhost:8080/api/users/7/pets/1/reminders').flush(
      { message: 'Falha no servidor' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(service.error()).toBeInstanceOf(Error);
    expect(service.isLoading()).toBe(false);
  });
});
