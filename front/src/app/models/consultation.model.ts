import { Pet } from './pet.model';

export enum ConsultationStatus {
  Scheduled = 'SCHEDULED',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED'
}

export interface Consultation {
  readonly id: number;
  readonly date: string;
  readonly veterinarian: string;
  readonly reason: string;
  readonly notes?: string | null;
  readonly status: ConsultationStatus;
}

export interface ConsultationListItem {
  readonly pet: Pet;
  readonly consultation: Consultation;
}

export interface CreateConsultationRequest {
  readonly date: string;
  readonly veterinarian: string;
  readonly reason: string;
  readonly notes?: string;
  readonly status: ConsultationStatus;
}

export type UpdateConsultationRequest = CreateConsultationRequest;
