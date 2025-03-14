import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
import { AggregateRoot } from '../../entities/aggregate';
import { UserAggregateRegisteredEvent } from '../events/aggregate-created.event';
import { UserAggregateRetrievedEvent } from '../events/aggregate-retrieved.event';

interface UserAggregateProps {
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregate extends AggregateRoot<UserAggregateProps> {
  private constructor(props: UserAggregateProps, aggregateId?: string) {
    super(props, aggregateId);
  }

  public static create(user: UserEntity, addresses: AddressEntity[], aggregateId?: string): UserAggregate {
    const userAggregate = new UserAggregate({ user, addresses }, aggregateId);
    const userEntity = userAggregate.getUser();
    const addressEntities = userAggregate.getAddresses();
    userAggregate.addDomainEvent(
      new UserAggregateRegisteredEvent({ user: userEntity, addresses: addressEntities, aggregateId: userAggregate.aggregateId }),
    );
    return userAggregate;
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
    const userAggregate = new UserAggregate({ user: userEntity, addresses: addressEntities }, aggregateId);
    userAggregate.addDomainEvent(
      new UserAggregateRetrievedEvent({ user: userEntity, addresses: addressEntities, aggregateId: userAggregate.aggregateId }),
    );

    return userAggregate;
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
