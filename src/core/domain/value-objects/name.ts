import { ONE_HUNDRED, THREE } from '@/core/types/constants';
import { WarnError } from '../../errors';
import { PrimitiveValueObject } from './primitiveValueObject';

export class NameVo extends PrimitiveValueObject<string> {
  static create(value?: string): NameVo {
    if (value == null || value.length === 0) {
      throw new WarnError({
        message: 'missing name value',
        statusCode: 400,
      });
    }

    if (value.length > ONE_HUNDRED) {
      throw new WarnError({
        message: 'name value is too long',
        statusCode: 400,
      });
    }

    if (value.length < THREE) {
      throw new WarnError({
        message: 'name value is too short',
        statusCode: 400,
      });
    }
    return new NameVo(value);
  }
}
