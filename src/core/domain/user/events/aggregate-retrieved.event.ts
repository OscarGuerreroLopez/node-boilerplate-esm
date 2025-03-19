import { DomainEvent } from '../../events/domain.event';
import { type AddressEntity } from '../entities/address.entity';
import { type UserEntity } from '../entities/user.entity';

interface UserAggregateRetrievedEventProps {
  entityId: string;
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregateRetrievedEvent extends DomainEvent {
  public readonly user: UserEntity;
  public readonly addresses: AddressEntity[];
  constructor({ user, addresses, entityId }: UserAggregateRetrievedEventProps) {
    super(entityId);
    this.user = user;
    this.addresses = addresses;
  }
}
