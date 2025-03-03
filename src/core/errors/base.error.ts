import { type BaseErrorArgs } from '../types/common';
import { HttpCode, type ValidationType } from '../types/http';

export class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpCode;
  public readonly isOperational: boolean;
  public readonly validationErrors?: ValidationType[];

  constructor(args: BaseErrorArgs) {
    const { message, name, statusCode, isOperational = true, validationErrors } = args;
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name ?? 'Application Error';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.validationErrors = validationErrors;
    Error.captureStackTrace(this);
  }

  static badRequest<T extends BaseError>(this: new (args: BaseErrorArgs) => T, message: string, validationErrors?: ValidationType[]): T {
    return new this({ name: 'BadRequestError', message, statusCode: HttpCode.BAD_REQUEST, validationErrors });
  }

  static unauthorized<T extends BaseError>(this: new (args: BaseErrorArgs) => T, message: string): T {
    return new this({ name: 'UnauthorizedError', message, statusCode: HttpCode.UNAUTHORIZED });
  }

  static forbidden<T extends BaseError>(this: new (args: BaseErrorArgs) => T, message: string): T {
    return new this({ name: 'ForbiddenError', message, statusCode: HttpCode.FORBIDDEN });
  }

  static notFound<T extends BaseError>(this: new (args: BaseErrorArgs) => T, message: string): T {
    return new this({ name: 'NotFoundError', message, statusCode: HttpCode.NOT_FOUND });
  }

  static internalServer<T extends BaseError>(this: new (args: BaseErrorArgs) => T, message: string): T {
    return new this({ name: 'InternalServerError', message, statusCode: HttpCode.INTERNAL_SERVER_ERROR });
  }
}
