import { type ValidationType, type CoreDto } from 'micro-library-ai';
import { type Address, type User } from '../types/user';
import { ZERO } from '../types/constants';
import { WarnError } from '../errors';
import { type Identifier } from '../types/common';

export interface UpdateUserDtoProps {
  identifier: Identifier;
  name?: string;
  email?: string;
  addresses?: Array<{ street: string; city: string; country: string }>;
  status?: string;
}

export class UpdateUserDto implements CoreDto<Partial<User>> {
  public readonly identifier: Identifier;
  public readonly name?: string;
  public readonly email?: string;
  public readonly addresses?: Address[];
  public readonly status?: string;

  constructor({ identifier, name, email, addresses, status }: UpdateUserDtoProps) {
    this.identifier = identifier;
    this.name = name;
    this.email = email;
    this.addresses = addresses?.map((address) => ({
      street: address.street ?? '',
      city: address.city ?? '',
      country: address.country ?? '',
    }));
    this.status = status;

    this.validate();
  }

  public validate(): void {
    const errors: ValidationType[] = [];

    // Ensure identifier follows the expected format
    if (this.identifier?.type.length === 0 || this.identifier?.value.length === 0) {
      errors.push({ fields: ['identifier'], constraint: 'Identifier must be properly formatted' });
    } else if (this.identifier?.type !== 'id' && this.identifier?.type !== 'aggregateId') {
      errors.push({ fields: ['identifier'], constraint: 'Identifier type must be either "id" or "aggregateId"' });
    }

    if (errors.length > ZERO) {
      throw WarnError.badRequest('Error validating update user data', errors);
    }
  }

  public static create(input: unknown): UpdateUserDto {
    const { identifier, name, email, addresses, status } = input as Record<string, any>;
    return new UpdateUserDto({ identifier, name, email, addresses, status });
  }
}
