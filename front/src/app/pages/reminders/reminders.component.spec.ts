import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { RemindersComponent } from './reminders.component';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';
import { ReminderService } from '../../services/reminder.service';
import { ReminderType } from '../../models/reminder.model';

const luna = { id: 1, name: 'Luna', species: 'Gato' };

describe('RemindersComponent', () => {
  function setup(createResult = of({ id: 9, type: ReminderType.Vaccine, description: 'Reforço', dueDate: '2026-07-10', completed: false })) {
    const petService = {
      isLoading: signal(false),
      listPets: vi.fn().mockReturnValue(of([luna]))
    };
    const reminderService = {
      isLoading: signal(false),
      search: signal(''),
      petId: signal<number | null>(null),
      type: signal<ReminderType | null>(null),
      completed: signal<boolean | null>(null),
      filteredItems: signal([
        { pet: luna, reminder: { id: 8, type: ReminderType.Vaccine, description: 'Reforço', dueDate: '2026-07-10', completed: false } }
      ]),
      listReminders: vi.fn().mockReturnValue(of([])),
      createReminder: vi.fn().mockReturnValue(createResult),
      setSearch: vi.fn((value: string) => reminderService.search.set(value)),
      setPetId: vi.fn((value: number | null) => reminderService.petId.set(value)),
      setType: vi.fn((value: ReminderType | null) => reminderService.type.set(value)),
      setCompleted: vi.fn((value: boolean | null) => reminderService.completed.set(value))
    };

    TestBed.configureTestingModule({
      imports: [RemindersComponent],
      providers: [
        { provide: AuthService, useValue: { currentUser: signal({ id: 7 }) } },
        { provide: PetService, useValue: petService },
        { provide: ReminderService, useValue: reminderService }
      ]
    });
    const fixture = TestBed.createComponent(RemindersComponent);
    fixture.detectChanges();
    return { component: fixture.componentInstance, reminderService };
  }

  it('exposes the backend reminder categories in the center filters', () => {
    const { component } = setup();
    expect(component.typeOptions.map(option => option.value)).toEqual([
      'all', ReminderType.Vaccine, ReminderType.Consultation, ReminderType.Medication, ReminderType.Other
    ]);
  });

  it('updates search and filters through the reusable controls state', () => {
    const { component, reminderService } = setup();
    component.reminderService.setSearch('reforço');
    component.petFilter.setValue('1');
    component.typeFilter.setValue(ReminderType.Vaccine);
    component.completedFilter.setValue('false');

    expect(reminderService.setSearch).toHaveBeenCalledWith('reforço');
    expect(reminderService.setPetId).toHaveBeenCalledWith(1);
    expect(reminderService.setType).toHaveBeenCalledWith(ReminderType.Vaccine);
    expect(reminderService.setCompleted).toHaveBeenCalledWith(false);
  });

  it('opens and closes the create reminder modal', () => {
    const { component } = setup();
    component.openCreateModal();
    expect(component.isCreateModalOpen()).toBe(true);
    component.closeCreateModal();
    expect(component.isCreateModalOpen()).toBe(false);
  });

  it('does not submit an invalid reminder form', () => {
    const { component, reminderService } = setup();
    component.submitCreate();
    expect(reminderService.createReminder).not.toHaveBeenCalled();
    expect(component.createForm.controls.description.touched).toBe(true);
  });

  it('creates without reload and closes the modal on success', () => {
    const { component, reminderService } = setup();
    component.openCreateModal();
    component.createForm.setValue({
      petId: '1', type: ReminderType.Vaccine, description: 'Reforço', dueDate: '2026-07-10'
    });
    component.submitCreate();

    expect(reminderService.createReminder).toHaveBeenCalledWith(7, luna, {
      type: ReminderType.Vaccine, description: 'Reforço', dueDate: '2026-07-10'
    });
    expect(component.isCreateModalOpen()).toBe(false);
    expect(component.successMessage()).toContain('adicionado');
  });

  it('keeps the modal open and shows an HTTP error on creation failure', () => {
    const { component } = setup(throwError(() => new Error('Falha HTTP')));
    component.openCreateModal();
    component.createForm.setValue({
      petId: '1', type: ReminderType.Vaccine, description: 'Reforço', dueDate: '2026-07-10'
    });
    component.submitCreate();

    expect(component.isCreateModalOpen()).toBe(true);
    expect(component.createErrorMessage()).toBe('Não foi possível criar o lembrete.');
  });
});
