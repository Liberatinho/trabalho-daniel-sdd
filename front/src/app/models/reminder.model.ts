export enum ReminderType {
  Vaccine = 'VACCINE',
  Consultation = 'CONSULTATION',
  Medication = 'MEDICATION',
  Other = 'OTHER'
}

export interface Reminder {
  readonly id: number;
  readonly type: ReminderType;
  readonly description: string;
  readonly dueDate: string;
  readonly completed: boolean;
}

export interface CreateReminderRequest {
  readonly type: ReminderType;
  readonly description: string;
  readonly dueDate: string;
  readonly completed?: boolean;
}

export type UpdateReminderRequest = CreateReminderRequest;
