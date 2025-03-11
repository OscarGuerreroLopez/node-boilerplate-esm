import { type UserEntity } from './user.entity';
import { type AddressEntity } from './address.entity';
import { AggregateRoot } from './aggregate';

interface UserAggregateProps {
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregate extends AggregateRoot<UserAggregateProps> {
  private constructor(props: UserAggregateProps, aggregateId?: string) {
    super(props, aggregateId);
  }

  public static create(user: UserEntity, addresses: AddressEntity[], aggregateId?: string): UserAggregate {
    return new UserAggregate({ user, addresses }, aggregateId);
  }

  public getUser(): UserEntity {
    return this.props.user;
  }

  public getAddresses(): AddressEntity[] {
    return [...this.props.addresses];
  }

  public addAddress(address: AddressEntity): void {
    this.props.addresses.push(address);
  }
}
