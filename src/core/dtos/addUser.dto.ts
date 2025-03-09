import { type ValidationType, type CoreDto } from 'micro-library-ai';
import { type Address, type User } from '../types/user';
import { ZERO } from '../types/constants';
import { WarnError } from '../errors';

export class AddUserDto implements CoreDto<User> {
  public readonly name: string;
  public readonly email: string;
  public readonly addresses: Address[];
  public readonly id?: string;

  private constructor({ name, email, addresses, id }: User) {
    this.name = name;
    this.email = email;
    this.addresses = addresses;
    this.id = id;
    this.validate(this);
  }

  public validate(dto: AddUserDto): void {
    const errors: ValidationType[] = [];
    const { email, name, addresses } = dto;

    if (name === undefined || name.trim() === '' || email === undefined || email.trim() === '') {
      errors.push({ fields: ['name', 'email'], constraint: 'Missing user data' });
    }

    if (addresses === undefined || addresses.length === 0) {
      errors.push({ fields: ['addresses'], constraint: 'Missing address data' });
    }

    if (errors.length > ZERO) {
      throw WarnError.badRequest('Error validating user data', errors);
    }
  }

  public static create(input: User): AddUserDto {
    return new AddUserDto(input);
  }
}
