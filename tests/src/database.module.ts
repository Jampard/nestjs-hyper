import { DynamicModule, Module } from '@nestjs/common';
import { HyperModule } from '../../lib';

@Module({})
export class DatabaseModule {
  static async forRoot(): Promise<DynamicModule> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      module: DatabaseModule,
      imports: [
        HyperModule.forRoot({
          connectionUri: './test-ram',
          retryAttempts: 2,
          retryDelay: 1000,
        }),
        // HyperModule.forRoot({
        //   name: 'connection_2',
        //   connectionUri: 'postgres://root:root@0.0.0.0:5432/test',
        //   retryAttempts: 2,
        //   retryDelay: 1000,
        // }),
      ],
    };
  }
}
