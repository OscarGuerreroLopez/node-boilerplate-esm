import { type Status } from '@/core/types/user';
import { type AddUserUsecaseResponse } from '../types/user/usecases';
import { type IAddressModel, type IUserModel } from '../types/models/user.model';

export class UserResponseDto implements IUserModel {
  id?: string;
  name: string;
  email: string;
  status: Status;
  addresses: IAddressModel[];
  kycStatus: Status;
  emailStatus: Status;
  entityId: string;

  constructor({ user, id }: AddUserUsecaseResponse) {
    const { name, email, addresses, status, kycStatus, emailStatus, entityId } = user.toValue();
    this.name = name;
    this.email = email;
    this.addresses = addresses;
    this.status = status;
    this.id = id;
    this.kycStatus = kycStatus;
    this.emailStatus = emailStatus;
    this.entityId = entityId;
  }

  public static create(userAggregate: AddUserUsecaseResponse): IUserModel {
    return new UserResponseDto(userAggregate);
  }
}
