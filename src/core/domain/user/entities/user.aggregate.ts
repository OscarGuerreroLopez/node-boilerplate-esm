import { UserEntity } from './user.entity';
import { AddressEntity } from './address.entity';
import { UserAggregateRegisteredEvent } from '../events/user-aggregate-register.event';
import { Entity } from '../../entities/entity';
import { type IUserAggregateModel } from '@/core/types/models/user.model';

interface UserAggregateProps {
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregate extends Entity<UserAggregateProps> {
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

  public static fromData({ email, name, addresses, status, entityId, kycStatus, emailStatus }: IUserAggregateModel): UserAggregate {
    const userEntity = UserEntity.fromData({ email, name, status, kycStatus, emailStatus });
    const addressEntities = addresses.map((address) => AddressEntity.fromData(address));
    const userAggregate = new UserAggregate({ user: userEntity, addresses: addressEntities }, entityId);
    userAggregate.addDomainEvent(
      new UserAggregateRegisteredEvent({ user: userEntity, addresses: addressEntities, entityId: userAggregate.entityId }),
    );

    return userAggregate;
  }

  public getUser(): UserEntity {
    return this.props.user;
  }

  public getAddresses(): AddressEntity[] {
    return [...this.props.addresses];
  }

  // toValue should not return MOdel
  public toValue(): IUserAggregateModel {
    const user = this.getUser().toValue();
    const addresses = this.getAddresses().map((address) => address.toValue());
    const entityId = this.entityId;
    return Object.freeze({
      ...user,
      addresses,
      entityId,
    });
  }

  public addAddress(address: AddressEntity): void {
    this.props.addresses.push(address);
  }
}
