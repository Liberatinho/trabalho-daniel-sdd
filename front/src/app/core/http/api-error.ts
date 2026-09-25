export interface ApiFieldErrors {
  readonly [field: string]: string;
}

export interface ApiErrorPayload {
  readonly timestamp?: string;
  readonly status?: number;
  readonly error?: string;
  readonly message?: string;
  readonly errors?: ApiFieldErrors;
}

export class ApiHttpError extends Error {
  readonly status: number;
  readonly errorName?: string;
  readonly fieldErrors: ApiFieldErrors;

  constructor(
    message: string,
    status: number,
    errorName?: string,
    fieldErrors: ApiFieldErrors = {}
  ) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
    this.errorName = errorName;
    this.fieldErrors = fieldErrors;
  }
}
