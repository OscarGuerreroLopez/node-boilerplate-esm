import { envs } from '@/core/config/env';
import { type CustomRequest } from '@/core/types/express-request';
import { type NextFunction, type Response } from 'express';
import { checkMongoDatabase } from '../services';
import { type MetaResponseDto, type SuccessResponse } from '@/core/dtos/response.dto';
import { AddUserDto } from '@/core/dtos/addUser.dto';
import { UserResponseDto } from '@/core/dtos/addUserResponse.dto';
import { addUserUsecase, getUserUsecase, updateUserUsecase } from '../usecases';
import { UpdateUserDto } from '@/core/dtos/updateUser.dto';

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

  public addUser = (req: CustomRequest, res: Response<SuccessResponse<UserResponseDto & { code: string }>>, next: NextFunction): void => {
    const { code } = req;

    const dto = AddUserDto.create(req.body);

    if (code == null) {
      next(new Error('Code is required'));
      return;
    }

    addUserUsecase({ user: dto, code })
      .then((result) => {
        res.json({
          serviceName: envs.SERVICE_NAME,
          data: { ...UserResponseDto.create(result), code },
        });
      })
      .catch(next);
  };

  public updateUser = (
    req: CustomRequest,
    res: Response<SuccessResponse<UserResponseDto & { code: string }>>,
    next: NextFunction,
  ): void => {
    const { code } = req;

    const { identifier, ...user } = UpdateUserDto.create(req.body);

    if (code == null) {
      next(new Error('Code is required'));
      return;
    }

    updateUserUsecase({
      user,
      code,
      identifier,
    })
      .then((result) => {
        res.json({
          serviceName: envs.SERVICE_NAME,
          data: { ...UserResponseDto.create(result), code },
        });
      })
      .catch(next);
  };

  public getUser = (req: CustomRequest, res: Response<SuccessResponse<UserResponseDto & { code: string }>>, next: NextFunction): void => {
    const { id } = req.params;
    const { code } = req;

    if (id == null) {
      next(new Error('ID is required'));
      return;
    }

    if (code == null) {
      next(new Error('Code is required'));
      return;
    }

    getUserUsecase(id, code)
      .then((result) => {
        res.json({
          serviceName: envs.SERVICE_NAME,
          data: { ...UserResponseDto.create(result), code },
        });
      })
      .catch(next);
  };
}
