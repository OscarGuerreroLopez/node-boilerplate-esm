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
    this.name = user.getUser().getName().value;
    this.email = user.getUser().getEmail().value;
    this.addresses = user.getAddresses().map((address) => ({
      street: address.getStreet().value,
      city: address.getCity().value,
      country: address.getCountry().value,
      status: address.getStatus().value,
      entityId: address.entityId,
    }));
    this.status = user.getUser().getStatus().value;
    this.id = id;
    this.kycStatus = user.getUser().getKycStatus().value;
    this.emailStatus = user.getUser().getEmailStatus().value;
    this.entityId = user.entityId;
  }

  public static create(userAggregate: AddUserUsecaseResponse): IUserModel {
    return new UserResponseDto(userAggregate);
  }
}
