import { type HttpCode, type ValidationType } from '../http';

export type IObjectLiteral = Record<string, any>;
export type NodeEnv = 'development' | 'test' | 'prod';
export enum NodeEnvEnum {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PROD = 'prod',
}
export interface BaseErrorArgs {
  name?: string;
  statusCode: HttpCode;
  message: string;
  isOperational?: boolean;
  validationErrors?: ValidationType[];
}
