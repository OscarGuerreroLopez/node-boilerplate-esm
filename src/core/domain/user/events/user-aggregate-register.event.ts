import { DomainEvent } from '../../events/domain.event';
import { type AddressEntity } from '../entities/address.entity';
import { type UserEntity } from '../entities/user.entity';

interface UserAggregateRegisteredEventProps {
  entityId: string;
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregateRegisteredEvent extends DomainEvent {
  public readonly user: UserEntity;
  public readonly addresses: AddressEntity[];
  constructor({ user, addresses, entityId }: UserAggregateRegisteredEventProps) {
    super(entityId);
    this.user = user;
    this.addresses = addresses;
  }
}
