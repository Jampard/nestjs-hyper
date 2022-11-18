import { DynamicModule, Module } from '@nestjs/common';
import { HyperCoreModule } from './hyper-core.module';
import { HyperModuleAsyncOptions, HyperModuleOptions } from './interfaces';

@Module({})
export class HyperModule {
  static forRoot(options: HyperModuleOptions): DynamicModule {
    return {
      module: HyperModule,
      imports: [HyperCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: HyperModuleAsyncOptions): DynamicModule {
    return {
      module: HyperModule,
      imports: [HyperCoreModule.forRootAsync(options)],
    };
  }
}
