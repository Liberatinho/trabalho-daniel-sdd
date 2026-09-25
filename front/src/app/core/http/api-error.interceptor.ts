import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import {
  ApiErrorPayload,
  ApiFieldErrors,
  ApiHttpError
} from './api-error';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const payload = readPayload(error.error);
      const message = payload.message ?? error.message ?? 'Não foi possível concluir a solicitação.';

      return throwError(
        () =>
          new ApiHttpError(
            message,
            error.status,
            payload.error,
            payload.errors
          )
      );
    })
  );

function readPayload(value: unknown): ApiErrorPayload {
  if (!isRecord(value)) {
    return {};
  }

  const fieldErrors = isRecord(value['errors'])
    ? readFieldErrors(value['errors'])
    : undefined;

  return {
    timestamp: readString(value['timestamp']),
    status: readNumber(value['status']),
    error: readString(value['error']),
    message: readString(value['message']),
    errors: fieldErrors
  };
}

function readFieldErrors(value: Record<string, unknown>): ApiFieldErrors {
  const errors: Record<string, string> = {};

  Object.entries(value).forEach(([field, message]) => {
    if (typeof message === 'string') {
      errors[field] = message;
    }
  });

  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}
