import { Status } from '@/core/types/user';
import { PrimitiveValueObject } from 'micro-library-ai';

export class UserStatusVo extends PrimitiveValueObject<Status> {
  static create(value?: Status): UserStatusVo {
    if (value == null) {
      return new UserStatusVo(Status.PENDING);
    }

    if (!Object.values(Status).includes(value)) {
      throw new Error(`Invalid UserStatus: ${value}`);
    }

    return new UserStatusVo(value);
  }
}
