import { type Status, type Address, type User } from '@/core/types/user';
import { type AddUserUsecaseResponse } from '../types/user/usecases';

export class UserResponseDto implements User {
  id?: string;
  name: string;
  email: string;
  status: Status;
  addresses: Address[];
  kycStatus: Status;
  emailStatus: Status;

  constructor({ user, id }: AddUserUsecaseResponse) {
    this.name = user.getUser().getName().value;
    this.email = user.getUser().getEmail().value;
    this.addresses = user.getAddresses().map((address) => ({
      street: address.getStreet().value,
      city: address.getCity().value,
      country: address.getCountry().value,
      status: address.getStatus().value,
    }));
    this.status = user.getUser().getStatus().value;
    this.id = id;
    this.kycStatus = user.getUser().getKycStatus().value;
    this.emailStatus = user.getUser().getEmailStatus().value;
  }

  public static create(userAggregate: AddUserUsecaseResponse): User {
    return new UserResponseDto(userAggregate);
  }
}
