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

export type Identifier = { type: 'id'; value: string } | { type: 'entityId'; value: string };

export type SanitiseBody = (unsanitisedBody: IObjectLiteral) => IObjectLiteral;

export enum Severity {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LoggerData {
  service: string;
  file: string;
  method?: string;
  code: string;
  [key: string]: unknown;
}

export interface Logger {
  debug: (message: string, data: LoggerData) => void;
  info: (message: string, data: LoggerData) => void;
  warn: (message: string, data: LoggerData) => void;
  error: (message: string, data: LoggerData) => void;
}
