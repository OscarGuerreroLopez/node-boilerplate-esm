import { type Status } from '@/core/types/user';
import { type AddUserUsecaseResponse } from '../types/user/usecases';
import { type IAddressModel, type IUserAggregateModel } from '../types/models/user.model';

export class UserResponseDto implements IUserAggregateModel {
  id?: string;
  name: string;
  email: string;
  status: Status;
  addresses: IAddressModel[];
  kycStatus: Status;
  emailStatus: Status;
  entityId: string;

  constructor({ user, id }: AddUserUsecaseResponse) {
    const { name, email, status, kycStatus, emailStatus, addresses, entityId } = user.toValue();
    this.name = name;
    this.email = email;
    this.addresses = addresses;
    this.status = status;
    this.id = id;
    this.kycStatus = kycStatus;
    this.emailStatus = emailStatus;
    this.entityId = entityId;
  }

  public static create(userAggregate: AddUserUsecaseResponse): IUserAggregateModel {
    return new UserResponseDto(userAggregate);
  }
}
