import { Observable } from 'rxjs';
import { HyperModuleOptions } from '../interfaces';
export declare function getPoolName(options: HyperModuleOptions): string;
export declare function getPoolToken(options?: HyperModuleOptions | string): string;
export declare function handleRetry(retryAttempts?: number, retryDelay?: number, poolName?: string, verboseRetryLog?: boolean, toRetry?: (err: any) => boolean): <T>(source: Observable<T>) => Observable<T>;
export declare const generateString: () => string;
