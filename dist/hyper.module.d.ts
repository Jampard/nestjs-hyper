import { DynamicModule } from '@nestjs/common';
import { HyperModuleAsyncOptions, HyperModuleOptions } from './interfaces';
export declare class HyperModule {
    static forRoot(options: HyperModuleOptions): DynamicModule;
    static forRootAsync(options: HyperModuleAsyncOptions): DynamicModule;
}
