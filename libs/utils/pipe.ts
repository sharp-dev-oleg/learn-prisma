import { timeout } from 'rxjs/operators';
import {
  BadRequestException,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { tap, TimeoutError } from 'rxjs';

const defaultTimeout = timeout(5000);
const defaultCatchError = tap({
  error: (err) => {
    Logger.log('Client error', err);
    if (err instanceof TimeoutError) {
      throw new RequestTimeoutException();
    }
    throw new BadRequestException(err?.message ?? 'Unknown error');
  },
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
