import { Inject } from '@nestjs/common';
import { HyperModuleOptions } from '../interfaces';
import { getPoolToken } from './hyper.utils';

export const InjectPool = (
  options?: HyperModuleOptions | string,
): ParameterDecorator => Inject(getPoolToken(options));
