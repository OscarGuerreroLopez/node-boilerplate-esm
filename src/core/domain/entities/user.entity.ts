import { Entity } from './entity';
import { UserRegisteredEvent } from '../events/user-register.event';
import { EmailVo } from '../value-objects/email';
import { NameVo } from '../value-objects/name';
import { type AddressEntity } from './address.entity';
import { OptionalIdVo } from '../value-objects/optionalId';
import { type User } from '@/core/types/user';

interface UserProps {
  email: EmailVo;
  name: NameVo;
  addresses: AddressEntity[];
  id: OptionalIdVo;
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps, entityId?: string) {
    super(props, entityId);
  }

  /** 📌 Factory method to create a new user */
  public static create({ email, name, id }: User): UserEntity {
    const emailVo = EmailVo.create(email);
    const nameVo = NameVo.create(name);
    const optionalIdVo = OptionalIdVo.create(id);
    const user = new UserEntity({ email: emailVo, name: nameVo, addresses: [], id: optionalIdVo });

    // Raise an event!
    user.addDomainEvent(new UserRegisteredEvent(user.entityId, emailVo.value, nameVo.value));

    return user;
  }

  public getName(): NameVo {
    return this.props.name;
  }

  public getEmail(): EmailVo {
    return this.props.email;
  }

  public getId(): OptionalIdVo {
    return this.props.id;
  }

  /** 📌 Add an address (must go through User) */
  public addAddress(address: AddressEntity): void {
    if (this.props.addresses.length >= 3) {
      throw new Error('A user can have a maximum of 3 addresses');
    }
    this.props.addresses.push(address);
  }

  /** 📌 Get all addresses */
  public getAddresses(): AddressEntity[] {
    return [...this.props.addresses];
  }
}
