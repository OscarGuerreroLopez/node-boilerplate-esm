import { envs } from '@/core/config/env';
import { LiveConnection } from './liveConnection';
import { TestConnection } from './testConnection';

export const Database = envs.NODE_ENV === 'test' ? TestConnection : LiveConnection;
