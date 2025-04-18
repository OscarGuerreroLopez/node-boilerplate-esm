import { ONE_HUNDRED, THREE } from '@/core/types/constants';
import { WarnError } from '../../errors';
import { PrimitiveValueObject } from './primitiveValueObject';

export class AddressVo extends PrimitiveValueObject<string> {
  static create(value?: string): AddressVo {
    if (value == null || value.length === 0) {
      throw new WarnError({
        message: 'missing address value',
        statusCode: 400,
      });
    }

    if (value.length > ONE_HUNDRED) {
      throw new WarnError({
        message: 'value in address is too long',
        statusCode: 400,
      });
    }

    if (value.length < THREE) {
      throw new WarnError({
        message: 'value in address is too short',
        statusCode: 400,
      });
    }
    return new AddressVo(value);
  }
}
