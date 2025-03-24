import * as winston from 'winston';
import { type LoggerData, NodeEnvEnum, Severity, type NodeEnv, type SanitiseBody, type Logger } from '@/core/types/common';

const { combine, timestamp, prettyPrint } = winston.format;

const createWinstonLogger = (nodeEnv: NodeEnv, transports: winston.transport[]): winston.Logger => {
  const logger = winston.createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports,
  });

  logger.on('error', (error) => {
    console.error('Logger Error caught', error);
  });

  if (nodeEnv === NodeEnvEnum.DEVELOPMENT || nodeEnv === NodeEnvEnum.TEST) {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }

  return logger;
};

const handleLoggingError = (method: string, error: unknown): void => {
  console.error(`Error in ${method} logger: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
};

const createMicroLoggerMethods = (logger: winston.Logger, bodySanitator: SanitiseBody): Logger => ({
  debug: (message: string, data: LoggerData): void => {
    try {
      logger.debug(message, bodySanitator(data));
    } catch (error) {
      handleLoggingError('debug', error);
    }
  },
  info: (message: string, data: LoggerData): void => {
    try {
      logger.info(message, bodySanitator(data));
    } catch (error) {
      handleLoggingError('info', error);
    }
  },
  warn: (message: string, data: LoggerData): void => {
    try {
      logger.warn(message, bodySanitator(data));
    } catch (error) {
      handleLoggingError('warn', error);
    }
  },
  error: (message: string, data: LoggerData): void => {
    try {
      logger.error(message, bodySanitator(data));
    } catch (error) {
      handleLoggingError('error', error);
    }
  },
});

export const makeMicroLogger = (nodeEnv: NodeEnv, bodySanitator: SanitiseBody): Logger => {
  const transports = [
    new winston.transports.File({
      filename: './logs/debug.log',
      level: Severity.DEBUG,
    }),
    new winston.transports.File({
      filename: './logs/info.log',
      level: Severity.INFO,
    }),
    new winston.transports.File({
      filename: './logs/warn.log',
      level: Severity.WARN,
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: Severity.ERROR,
    }),
  ];

  const winstonLogger = createWinstonLogger(nodeEnv, transports);
  return createMicroLoggerMethods(winstonLogger, bodySanitator);
};

export const makeMicroLoggerV2 = (nodeEnv: NodeEnv, bodySanitator: SanitiseBody): Logger => {
  const transports = [
    new winston.transports.Console({
      format: winston.format.simple(),
      level: Severity.DEBUG,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: Severity.INFO,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: Severity.WARN,
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: Severity.ERROR,
    }),
  ];

  const winstonLogger = createWinstonLogger(nodeEnv, transports);
  return createMicroLoggerMethods(winstonLogger, bodySanitator);
};
