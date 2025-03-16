import { type AddressEntity } from '../entities/address.entity';
import { type UserEntity } from '../entities/user.entity';
import { AggregateDomainEvent } from '../../events/aggregate-domain.event';

interface UserAggregateRegisteredEventProps {
  aggregateId: string;
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregateRegisteredEvent extends AggregateDomainEvent {
  public readonly user: UserEntity;
  public readonly addresses: AddressEntity[];
  constructor({ user, addresses, aggregateId }: UserAggregateRegisteredEventProps) {
    super(aggregateId);
    this.user = user;
    this.addresses = addresses;
  }
}
