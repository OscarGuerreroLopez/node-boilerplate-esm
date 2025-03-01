import { envs } from '@/core/config/env';
import { type CustomRequest } from '@/core/types/express-request';
import { type NextFunction, type Response } from 'express';
import { type SuccessResponse, type MetaResponseDto } from 'micro-library-ai';
import { checkMongoDatabase } from '../services';

export class MyAppController {
  public getMeta = async (
    req: CustomRequest,
    res: Response<SuccessResponse<MetaResponseDto & { dbName: string }>>,
    next: NextFunction,
  ): Promise<void> => {
    checkMongoDatabase()
      .then((result) => {
        res.json({
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
