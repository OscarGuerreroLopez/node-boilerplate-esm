import { envs } from '@/core/config/env';
import { DbConnection } from './client';

export const SqlDatabase = envs.NODE_ENV === 'test' ? DbConnection(envs.DATABASE_URL_TEST) : DbConnection(envs.DATABASE_URL);
