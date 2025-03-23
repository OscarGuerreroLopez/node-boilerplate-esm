import { type ValidationType, type CoreDto } from 'micro-library-ai';
import { type Status, type Address, type User } from '../types/user';
import { ZERO } from '../types/constants';
import { WarnError } from '../errors';
import { type Identifier } from '../types/common';

export interface UpdateUserDtoProps {
  identifier: Identifier;
  name?: string;
  email?: string;
  addresses?: Address[];
  status?: Status;
  kycStatus?: Status;
  emailStatus?: Status;
}

export class UpdateUserDto implements CoreDto<Partial<User>> {
  public readonly identifier: Identifier;
  public readonly name?: string;
  public readonly email?: string;
  public readonly addresses?: Array<Partial<Address>>;
  public readonly status?: Status;
  public readonly kycStatus?: Status;
  public readonly emailStatus?: Status;

  constructor({ identifier, name, email, addresses, status, kycStatus, emailStatus }: UpdateUserDtoProps) {
    this.identifier = identifier;
    this.name = name;
    this.email = email;
    this.addresses = addresses?.map((address) => ({
      street: address.street,
      city: address.city,
      country: address.country,
      status: address.status,
    }));
    this.status = status;
    this.kycStatus = kycStatus;
    this.emailStatus = emailStatus;

    this.validate();
  }

  public validate(): void {
    const errors: ValidationType[] = [];

    if (this.identifier?.type.length === 0 || this.identifier?.value.length === 0) {
      errors.push({ fields: ['identifier'], constraint: 'Identifier must be properly formatted' });
    } else if (this.identifier?.type !== 'id' && this.identifier?.type !== 'entityId') {
      errors.push({ fields: ['identifier'], constraint: 'Identifier type must be either "id" or "entityId"' });
    }

    if (errors.length > ZERO) {
      throw WarnError.badRequest('Error validating update user data', errors);
    }
  }

  public static create(input: unknown): UpdateUserDto {
    const { identifier, name, email, addresses, status, kycStatus, emailStatus } = input as Record<string, any>;
    return new UpdateUserDto({ identifier, name, email, addresses, status, kycStatus, emailStatus });
  }
}
