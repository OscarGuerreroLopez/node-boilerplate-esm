import { WarnError } from '../../errors';
import { PrimitiveValueObject } from './primitiveValueObject';

export class EmailVo extends PrimitiveValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static create(value: string): EmailVo {
    if (value.length === 0) {
      throw new WarnError({
        message: 'Email is required',
        statusCode: 400,
      });
    }

    if (!this.EMAIL_REGEX.test(value)) {
      throw new WarnError({
        message: 'Invalid email format',
        statusCode: 400,
      });
    }

    return new EmailVo(value);
  }
}
