import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
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

  public static fromData({
    email,
    name,
    addresses,
    aggregateId,
  }: {
    email: string;
    name: string;
    addresses: Array<{ street: string; city: string; country: string }>;
    aggregateId: string;
  }): UserAggregate {
    const userEntity = UserEntity.fromData({ email, name });
    const addressEntities = addresses.map((address) => AddressEntity.fromData(address));
    return new UserAggregate({ user: userEntity, addresses: addressEntities }, aggregateId);
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
