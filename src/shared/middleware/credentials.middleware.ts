import { type Response, type NextFunction } from 'express';
import { logger } from '../logger';
import { type CustomRequest } from '@/core/types/express-request';
import { envs } from '@/core/config/env';
import { AppError } from '@/core/errors';
import { type ErrorResponse } from '@/core/types/http';

export const credentialsMiddleware = (req: CustomRequest, _res: Response<ErrorResponse>, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;

  if (apiKey !== envs.API_KEY) {
    logger.warn(`Invalid apiKey ${apiKey}`, {
      service: 'BoilerPlate',
      file: 'credentials.middleware.ts',
      code: req.code ?? 'no Code',
    });
    next(AppError.forbidden('Not Authorized'));
  }

  next();
};
