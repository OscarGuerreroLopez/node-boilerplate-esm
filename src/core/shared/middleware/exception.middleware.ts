import { type Response, type NextFunction } from 'express';
import { HttpCode, type ErrorResponse, type ValidationType } from 'micro-library-ai';
import { logger } from '../logger';
import { type CustomRequest } from '@/core/types/express-request';
import { AppError, WarnError } from '@/core/errors';

interface HandleErrorParams {
  res: Response<ErrorResponse>;
  name: string;
  message: string;
  statusCode: number;
  code?: string;
}

const logError = (message: string, req: CustomRequest, stack?: string, validationErrors?: ValidationType[]): void => {
  logger.error(message, {
    file: 'exception.middleware.ts',
    code: req.code ?? 'no code',
    service: 'BoilerPlate',
    stack,
    validationErrors,
  });
};

const logWarn = (message: string, req: CustomRequest, stack?: string, validationErrors?: ValidationType[]): void => {
  logger.warn(message, {
    file: 'exception.middleware.ts',
    code: req.code ?? 'no code',
    service: 'BoilerPlate',
    stack,
    validationErrors,
  });
};

const handleErrorResponse = ({ res, name, message, statusCode, code = 'no code' }: HandleErrorParams): void => {
  res.status(statusCode).json({ name, message, code });
};

const processError = (
  error: AppError | WarnError | Error | unknown,
  req: CustomRequest,
  res: Response<ErrorResponse>,
  code: string,
): void => {
  let name: string;
  let message: string = 'check logs';
  let statusCode: HttpCode = HttpCode.INTERNAL_SERVER_ERROR;
  let stack: string | undefined;
  let validationErrors: ValidationType[] | undefined;

  switch (true) {
    case error instanceof AppError:
      ({ name, message, stack, validationErrors } = error);
      statusCode = error.statusCode ?? statusCode;
      logError(message, req, stack, validationErrors);
      break;

    case error instanceof WarnError:
      ({ name, message, stack, validationErrors } = error);
      statusCode = error.statusCode ?? statusCode;
      logWarn(message, req, stack, validationErrors);
      break;

    case error instanceof Error:
      name = 'GenericError';
      message = error.message;
      stack = error.stack;
      logError(message, req, stack);
      break;

    default:
      name = 'InternalServerError';
      message = JSON.stringify(error);
      logError(message, req);
      break;
  }

  handleErrorResponse({ res, name, message, statusCode, code });
};
export const ExceptionMiddleware = (error: Error, req: CustomRequest, res: Response<ErrorResponse>, next: NextFunction): void => {
  processError(error, req, res, req.code ?? 'no code');
  next();
};

export default ExceptionMiddleware;
