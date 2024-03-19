import { catchError, timeout } from 'rxjs/operators';
import { Logger, RequestTimeoutException } from '@nestjs/common';
import { throwError, tap, TimeoutError } from 'rxjs';

const defaultTimeout = timeout(5000);
const defaultCatchError = catchError((err) => {
  Logger.log(err);
  if (err instanceof TimeoutError) {
    return throwError(new RequestTimeoutException());
  }
  return throwError(err);
});

export const getClientPipeOperators = (): [
  typeof defaultTimeout,
  typeof defaultCatchError,
] => [defaultTimeout, defaultCatchError];

export const getClientPipeOperatorsWithTap = (
  pipeTap: ReturnType<typeof tap>,
): [typeof defaultTimeout, typeof pipeTap, typeof defaultCatchError] => [
  defaultTimeout,
  pipeTap,
  defaultCatchError,
];
