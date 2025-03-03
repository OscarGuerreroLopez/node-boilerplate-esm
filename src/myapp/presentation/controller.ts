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
}
