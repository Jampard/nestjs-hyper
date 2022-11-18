import { Module } from '@nestjs/common';
import {
  HyperModule,
  HyperModuleOptions,
  HyperOptionsFactory,
} from '../../lib';
import { PhotoModule } from './photo/photo.module';

class ConfigService implements HyperOptionsFactory {
  createHyperOptions(): HyperModuleOptions {
    return {
      connectionUri: './test-ram',
      retryAttempts: 2,
      retryDelay: 1000,
    };
  }
}

@Module({
  imports: [
    HyperModule.forRootAsync({
      useClass: ConfigService,
    }),
    // HyperModule.forRoot({
    //   name: 'connection_2',
    //   connectionUri: 'postgres://root:root@0.0.0.0:5432/test',
    //   retryAttempts: 2,
    //   retryDelay: 1000,
    // }),
    PhotoModule,
  ],
})
export class AsyncOptionsClassModule { }
