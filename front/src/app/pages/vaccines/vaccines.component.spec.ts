import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { VaccinesComponent } from './vaccines.component';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';
import { VaccineService } from '../../services/vaccine.service';

const luna = { id: 1, name: 'Luna', species: 'Gato' };

describe('VaccinesComponent', () => {
  function setup(createResult = of({ id: 9, name: 'V10', applicationDate: '2026-03-01' })) {
    const petService = {
      isLoading: signal(false),
      listPets: vi.fn().mockReturnValue(of([luna]))
    };
    const vaccineService = {
      isLoading: signal(false),
      search: signal(''),
      petId: signal<number | null>(null),
      filteredItems: signal([]),
      listVaccines: vi.fn().mockReturnValue(of([])),
      createVaccine: vi.fn().mockReturnValue(createResult),
      setSearch: vi.fn((value: string) => vaccineService.search.set(value)),
      setPetId: vi.fn((value: number | null) => vaccineService.petId.set(value))
    };

    TestBed.configureTestingModule({
      imports: [VaccinesComponent],
      providers: [
        { provide: AuthService, useValue: { currentUser: signal({ id: 7 }) } },
        { provide: PetService, useValue: petService },
        { provide: VaccineService, useValue: vaccineService }
      ]
    });
    const fixture = TestBed.createComponent(VaccinesComponent);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance, vaccineService };
  }

  it('opens and closes the registration modal', () => {
    const { component } = setup();

    component.openCreateModal();
    expect(component.isCreateModalOpen()).toBe(true);

    component.closeCreateModal();
    expect(component.isCreateModalOpen()).toBe(false);
  });

  it('does not submit an invalid registration', () => {
    const { component, vaccineService } = setup();

    component.submitCreate();

    expect(vaccineService.createVaccine).not.toHaveBeenCalled();
    expect(component.createForm.controls.name.touched).toBe(true);
  });

  it('submits the backend contract, closes the modal and keeps the in-memory list updated', () => {
    const { component, vaccineService } = setup();
    component.openCreateModal();
    component.createForm.setValue({
      petId: '1',
      name: 'V10',
      applicationDate: '2026-03-01',
      nextDoseDate: '2027-03-01',
      notes: 'Reforço anual'
    });

    component.submitCreate();

    expect(vaccineService.createVaccine).toHaveBeenCalledWith(7, luna, {
      name: 'V10',
      applicationDate: '2026-03-01',
      nextDoseDate: '2027-03-01',
      notes: 'Reforço anual'
    });
    expect(component.isCreateModalOpen()).toBe(false);
    expect(component.successMessage()).toContain('histórico');
  });

  it('keeps the modal open and shows an API error when registration fails', () => {
    const { component } = setup(throwError(() => new Error('Falha no servidor')));
    component.openCreateModal();
    component.createForm.setValue({
      petId: '1', name: 'V10', applicationDate: '2026-03-01', nextDoseDate: '', notes: ''
    });

    component.submitCreate();

    expect(component.isCreateModalOpen()).toBe(true);
    expect(component.createErrorMessage()).toBe('Não foi possível registrar a vacina.');
  });
});
