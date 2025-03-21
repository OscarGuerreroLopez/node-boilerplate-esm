import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
import { AggregateRoot } from '../../entities/aggregate';
import { UserAggregateRegisteredEvent } from '../events/user-aggregate-register.event';
import { UserAggregateRetrievedEvent } from '../events/aggregate-retrieved.event';
import { type IUserModel } from '@/core/types/models/user.model';

interface UserAggregateProps {
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregate extends AggregateRoot<UserAggregateProps> {
  private constructor(props: UserAggregateProps, entityId?: string) {
    super(props, entityId);
  }

  public static create(user: UserEntity, addresses: AddressEntity[], entityId?: string): UserAggregate {
    const userAggregate = new UserAggregate({ user, addresses }, entityId);
    const userEntity = userAggregate.getUser();
    const addressEntities = userAggregate.getAddresses();
    userAggregate.addDomainEvent(
      new UserAggregateRegisteredEvent({ user: userEntity, addresses: addressEntities, entityId: userAggregate.entityId }),
    );
    return userAggregate;
  }

  public static fromData({ email, name, addresses, status, entityId }: IUserModel): UserAggregate {
    const userEntity = UserEntity.fromData({ email, name, status });
    const addressEntities = addresses.map((address) => AddressEntity.fromData(address));
    const userAggregate = new UserAggregate({ user: userEntity, addresses: addressEntities }, entityId);
    userAggregate.addDomainEvent(
      new UserAggregateRetrievedEvent({ user: userEntity, addresses: addressEntities, entityId: userAggregate.entityId }),
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
