import { DynamicModule, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { HyperModuleAsyncOptions, HyperModuleOptions } from './interfaces';
export declare class HyperCoreModule implements OnApplicationShutdown {
    private readonly options;
    private readonly moduleRef;
    private readonly logger;
    constructor(options: HyperModuleOptions, moduleRef: ModuleRef);
    static forRoot(options: HyperModuleOptions): DynamicModule;
    static forRootAsync(options: HyperModuleAsyncOptions): DynamicModule;
    onApplicationShutdown(): Promise<void>;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
    private static createPoolFactory;
}
