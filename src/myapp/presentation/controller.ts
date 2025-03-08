import { envs } from '@/core/config/env';
import { type CustomRequest } from '@/core/types/express-request';
import { type NextFunction, type Response } from 'express';
import { checkMongoDatabase } from '../services';
import { type MetaResponseDto, type SuccessResponse } from '@/core/dtos/response.dto';

export class MyAppController {
  public getMeta = (req: CustomRequest, res: Response<SuccessResponse<MetaResponseDto>>, next: NextFunction): void => {
    checkMongoDatabase()
      .then((result) => {
        res.json({
          serviceName: envs.SERVICE_NAME,
          data: {
            message: 'OK',
            code: req.code ?? 'noCode',
            platform: envs.PLATFORM,
            environment: envs.NODE_ENV,
            dbName: result,
          },
        });
      })
      .catch(next);
  };

  public addUser = (req: CustomRequest, res: Response<SuccessResponse<unknown>>, next: NextFunction): void => {
    const { name, email, addresses } = req.body as {
      name: string;
      email: string;
      addresses: Array<{ street: string; city: string; country: string }>;
    };
    const { code } = req as { code: string };

    if (name === undefined || name.trim() === '' || email === undefined || email.trim() === '') {
      next(new Error('Name and email are required!'));
    }

    if (addresses === undefined || addresses.length === 0) {
      next(new Error('Addresses are required!'));
    }

    if (code === undefined || code.trim() === '') {
      next(new Error('Missing code'));
    }

    res.json({
      serviceName: envs.SERVICE_NAME,
      data: 'add user',
    });
  };
}
