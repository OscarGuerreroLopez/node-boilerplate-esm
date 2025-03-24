import { envs } from '@/core/config/env';
import { NodeEnvEnum, type NodeEnv } from '@/core/types/common';
import { sanitiser } from '../helpers/sanitiser';
import { makeMicroLogger, makeMicroLoggerV2 } from './microLogger';

export const logger =
  envs.NODE_ENV === NodeEnvEnum.DEVELOPMENT
    ? makeMicroLogger(envs.NODE_ENV as NodeEnv, sanitiser)
    : makeMicroLoggerV2(envs.NODE_ENV as NodeEnv, sanitiser);
