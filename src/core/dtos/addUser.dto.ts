import { type ValidationType, type CoreDto } from 'micro-library-ai';
import { type Address, type User } from '../types/user';
import { ZERO } from '../types/constants';
import { WarnError } from '../errors';

export interface AddUserDtoProps {
  name: string;
  email: string;
  addresses: Array<{ street: string; city: string; country: string }>;
}

export class AddUserDto implements CoreDto<User> {
  public readonly name: string;
  public readonly email: string;
  public readonly addresses: Address[] = [];

  constructor({ name, email, addresses }: AddUserDtoProps) {
    this.name = name;
    this.email = email;
    this.addresses = addresses.map((address) => ({
      street: address.street ?? '',
      city: address.city ?? '',
      country: address.country ?? '',
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

    if (errors.length > ZERO) {
      throw WarnError.badRequest('Error validating user data', errors);
    }
  }

  public static create(input: unknown): AddUserDto {
    const { name, email, addresses } = input as Record<string, any>;
    return new AddUserDto({ name, email, addresses: addresses ?? [] });
  }
}
