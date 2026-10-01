import type { Pet } from './pet.model';

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly pets?: readonly Pet[];
}

export interface CreateUserRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface UpdateUserRequest {
  readonly name: string;
  readonly email: string;
  readonly password?: string;
}
