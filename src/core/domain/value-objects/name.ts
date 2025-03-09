import { ONE_HUNDRED, PrimitiveValueObject, THREE } from 'micro-library-ai';
import { WarnError } from '../../errors';

export class NameVo extends PrimitiveValueObject<string> {
  static create(value: string): NameVo {
    if (value.length === 0) {
      throw new WarnError({
        message: 'missing value',
        statusCode: 400,
      });
    }

    if (value.length > ONE_HUNDRED) {
      throw new WarnError({
        message: 'value is too long',
        statusCode: 400,
      });
    }

    if (value.length < THREE) {
      throw new WarnError({
        message: 'value is too short',
        statusCode: 400,
      });
    }
    return new NameVo(value);
  }
}
