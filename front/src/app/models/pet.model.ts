export interface Pet {
  readonly id: number;
  readonly name: string;
  readonly species: string;
  readonly breed?: string | null;
  readonly birthDate?: string | null;
  readonly notes?: string | null;
}

export interface CreatePetRequest {
  readonly name: string;
  readonly species: string;
  readonly breed?: string;
  readonly birthDate?: string;
  readonly notes?: string;
}

export type UpdatePetRequest = CreatePetRequest;
