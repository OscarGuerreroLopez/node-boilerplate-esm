import { envs } from '@/core/config/env';
import { type CustomRequest } from '@/core/types/express-request';
import { type NextFunction, type Response } from 'express';
import { type SuccessResponse, type MetaResponseDto } from 'micro-library-ai';

export class MyAppController {
  public getMeta = (req: CustomRequest, res: Response<SuccessResponse<MetaResponseDto>>, next: NextFunction): void => {
    res.json({
      data: {
        message: 'OK',
        code: req.code ?? 'noCode',
        platform: envs.PLATFORM,
        environment: envs.NODE_ENV,
      },
    });
  };
}
