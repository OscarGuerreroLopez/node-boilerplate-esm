import { Entity } from './entity';
import { UserRegisteredEvent } from '../events/user-register.event';
import { EmailVo } from '../value-objects/email';
import { NameVo } from '../value-objects/name';
import { type AddressEntity } from './address.entity';

interface UserProps {
  email: EmailVo;
  name: NameVo;
  addresses: AddressEntity[];
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps, entityId?: string) {
    super(props, entityId);
  }

  /** 📌 Factory method to create a new user */
  public static create(email: string, name: string): UserEntity {
    const emailVo = EmailVo.create(email);
    const nameVo = NameVo.create(name);
    const user = new UserEntity({ email: emailVo, name: nameVo, addresses: [] });

    // Raise an event!
    user.addDomainEvent(new UserRegisteredEvent(user.entityId, emailVo.value, nameVo.value));

    return user;
  }

  /** 📌 Add an address (must go through User) */
  public addAddress(address: AddressEntity): void {
    if (this.props.addresses.length >= 5) {
      throw new Error('A user can have a maximum of 5 addresses');
    }
    this.props.addresses.push(address);
  }

  /** 📌 Get all addresses */
  public getAddresses(): AddressEntity[] {
    return [...this.props.addresses];
  }
}
