import { Type, ModuleMetadata } from '@nestjs/common';
// import { ClientConfigurationInput } from 'slonik';

export interface HyperOptions {
  connectionUri: string;
  // clientConfigurationInput?: ClientConfigurationInput;
}

export interface HyperModuleOptions extends HyperOptions {
  /**
   * Connection pool name
   */
  name?: string;

  /**
   * Function that determines whether the module should
   * attempt to connect upon failure.
   *
   * @param err error that was thrown
   * @returns whether to retry connection or not
   */
  toRetry?: (err: any) => boolean;
  /**
   * If `true`, will show verbose error messages on each connection retry.
   */
  verboseRetryLog?: boolean;
  /**
   * Number of times to retry connecting
   * Default: 10
   */
  retryAttempts?: number;
  /**
   * Delay between connection retry attempts (ms)
   * Default: 3000
   */
  retryDelay?: number;
}

export interface HyperOptionsFactory {
  createHyperOptions(
    poolName?: string,
  ): Promise<HyperModuleOptions> | HyperModuleOptions;
}

export interface HyperModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<HyperOptionsFactory>;
  useClass?: Type<HyperOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<HyperModuleOptions> | HyperModuleOptions;
  inject?: any[];
}
