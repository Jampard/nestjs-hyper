import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';
import { DEFAULT_POOL_NAME } from '../hyper.constants';
import { HyperModuleOptions } from '../interfaces';

const logger = new Logger('HyperModule');

export function getPoolName(options: HyperModuleOptions): string {
  return options && options.name ? options.name : DEFAULT_POOL_NAME;
}

/**
 * This function returns a Pool injection token for the given HyperModuleOptions or pool name.
 * @param options {HyperModuleOptions | string} [options='default'] This optional parameter is either
 * a HyperModuleOptions or a string.
 * @returns {string} The Pool injection token.
 */
export function getPoolToken(
  options: HyperModuleOptions | string = DEFAULT_POOL_NAME,
): string {
  const name = typeof options === 'string' ? options : getPoolName(options);

  return `${name}HyperPool`;
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
  poolName = DEFAULT_POOL_NAME,
  verboseRetryLog = false,
  toRetry?: (err: any) => boolean,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error: Error) => {
            if (toRetry && !toRetry(error)) {
              throw error;
            }
            const poolInfo =
              poolName === DEFAULT_POOL_NAME ? '' : ` (${poolName})`;
            const verboseMessage = verboseRetryLog
              ? ` Message: ${error.message}.`
              : '';

            logger.error(
              `Unable to connect to the database${poolInfo}.${verboseMessage} Retrying (${errorCount + 1
              })...`,
              error.stack,
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}

export const generateString = (): string => uuid();
