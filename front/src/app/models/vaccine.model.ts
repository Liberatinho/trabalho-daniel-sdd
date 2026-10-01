import { Pet } from './pet.model';

export interface Vaccine {
  readonly id: number;
  readonly name: string;
  readonly applicationDate: string;
  readonly nextDoseDate?: string | null;
  readonly notes?: string | null;
}

export interface VaccineListItem {
  readonly pet: Pet;
  readonly vaccine: Vaccine;
}

export interface CreateVaccineRequest {
  readonly name: string;
  readonly applicationDate: string;
  readonly nextDoseDate?: string;
  readonly notes?: string;
}

export type UpdateVaccineRequest = CreateVaccineRequest;
