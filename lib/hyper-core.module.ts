import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnApplicationShutdown,
  Provider,
  Type,
  Logger,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { defer, lastValueFrom } from 'rxjs';
import { createPool, DatabasePool } from 'hyper';
import {
  generateString,
  getPoolName,
  getPoolToken,
  handleRetry,
} from './common';
import {
  HyperModuleAsyncOptions,
  HyperModuleOptions,
  HyperOptionsFactory,
} from './interfaces';
import { HYPER_MODULE_ID, HYPER_MODULE_OPTIONS } from './hyper.constants';

@Global()
@Module({})
export class HyperCoreModule implements OnApplicationShutdown {
  private readonly logger = new Logger('HyperModule');

  constructor(
    @Inject(HYPER_MODULE_OPTIONS)
    private readonly options: HyperModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) { }

  static forRoot(options: HyperModuleOptions): DynamicModule {
    const hyperOptions = {
      provide: HYPER_MODULE_OPTIONS,
      useValue: options,
    };
    const poolProvider = {
      provide: getPoolToken(options),
      useFactory: async () => this.createPoolFactory(options),
    };

    return {
      module: HyperCoreModule,
      providers: [poolProvider, hyperOptions],
      exports: [poolProvider],
    };
  }

  static forRootAsync(options: HyperModuleAsyncOptions): DynamicModule {
    const poolProvider = {
      provide: getPoolToken(options as HyperModuleOptions),
      useFactory: async (hyperOptions: HyperModuleOptions) => {
        if (options.name) {
          return this.createPoolFactory({
            ...hyperOptions,
            name: options.name,
          });
        }
        return this.createPoolFactory(hyperOptions);
      },
      inject: [HYPER_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: HyperCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        poolProvider,
        {
          provide: HYPER_MODULE_ID,
          useValue: generateString(),
        },
      ],
      exports: [poolProvider],
    };
  }

  async onApplicationShutdown(): Promise<void> {
    const pool = this.moduleRef.get<DatabasePool>(getPoolToken(this.options));
    try {
      // https://github.com/gajus/hyper#end-connection-pool
      // The result of pool.end() is a promise that is resolved when all connections are ended.
      // Note: pool.end() does not terminate active connections/ transactions.
      await pool?.end();
    } catch (e: any) {
      this.logger.error(e?.message);
    }
  }

  private static createAsyncProviders(
    options: HyperModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<HyperOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: HyperModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: HYPER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<HyperOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<HyperOptionsFactory>,
    ];
    return {
      provide: HYPER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: HyperOptionsFactory) =>
        optionsFactory.createHyperOptions(options.name),
      inject,
    };
  }

  private static async createPoolFactory(
    options: HyperModuleOptions,
  ): Promise<DatabasePool> {
    const poolToken = getPoolName(options);

    return await lastValueFrom(
      defer(async () => {
        const pool = await createPool(
          options.connectionUri,
          // options.clientConfigurationInput,
        );

        // try to connect to database to catch errors if database is not reachable
        // await pool.connect(() => Promise.resolve());

        return pool;
      }).pipe(
        handleRetry(
          options.retryAttempts,
          options.retryDelay,
          poolToken,
          options.verboseRetryLog,
          options.toRetry,
        ),
      ),
    );
  }
}
