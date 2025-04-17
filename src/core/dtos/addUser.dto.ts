import { ZERO } from '../types/constants';
import { WarnError } from '../errors';
import { type CoreDto } from './core.dto';
import { type ValidationType } from '../types/http';
import { type IAddressModel, type IUserAggregateModel } from '../types/models/user.model';
import { Status } from '../types/user';

export class AddUserDto implements CoreDto<IUserAggregateModel> {
  public readonly name: string;
  public readonly email: string;
  public readonly addresses: IAddressModel[] = [];

  constructor({
    name,
    email,
    addresses,
  }: Pick<IUserAggregateModel, 'name' | 'email'> & {
    addresses: Array<{ street: string; city: string; country: string; status: Status; entityId: string }>;
  }) {
    this.name = name;
    this.email = email;
    this.addresses = addresses.map((address) => ({
      street: address.street ?? '',
      city: address.city ?? '',
      country: address.country ?? '',
      status: address.status ?? Status.PENDING,
      entityId: address.entityId ?? '',
    }));
    this.validate();
  }

  public validate(): void {
    const errors: ValidationType[] = [];

    if (this.name === undefined || this.name.trim() === '' || this.email === undefined || this.email.trim() === '') {
      errors.push({ fields: ['name', 'email'], constraint: 'Missing user data' });
    }

    if (this.addresses === undefined || this.addresses.length === 0) {
      errors.push({ fields: ['addresses'], constraint: 'Missing address data' });
    }

    if (this.addresses.length > 3) {
      errors.push({ fields: ['addresses'], constraint: 'Max 3 addresses' });
    }

    if (errors.length > ZERO) {
      throw WarnError.badRequest('Error validating user data', errors);
    }
  }

  public static create(input: unknown): AddUserDto {
    const { name, email, addresses } = input as Record<string, any>;
    return new AddUserDto({ name, email, addresses: addresses ?? [] });
  }
}
