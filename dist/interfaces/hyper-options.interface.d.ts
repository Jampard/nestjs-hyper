import { Type, ModuleMetadata } from '@nestjs/common';
export interface HyperOptions {
    connectionUri: string;
}
export interface HyperModuleOptions extends HyperOptions {
    name?: string;
    toRetry?: (err: any) => boolean;
    verboseRetryLog?: boolean;
    retryAttempts?: number;
    retryDelay?: number;
}
export interface HyperOptionsFactory {
    createHyperOptions(poolName?: string): Promise<HyperModuleOptions> | HyperModuleOptions;
}
export interface HyperModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useExisting?: Type<HyperOptionsFactory>;
    useClass?: Type<HyperOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<HyperModuleOptions> | HyperModuleOptions;
    inject?: any[];
}
