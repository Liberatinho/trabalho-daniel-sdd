import { ConsultationStatus } from './consultation.model';
import { ReminderType } from './reminder.model';

export interface ConsultationFilters {
  readonly status?: ConsultationStatus;
}

export interface ReminderFilters {
  readonly type?: ReminderType;
  readonly completed?: boolean;
}

export interface PetListFilters {
  readonly search?: string;
}

export interface VaccineListFilters {
  readonly search?: string;
  readonly petId?: number;
}
