import { type AddressEntity } from '../entities/address.entity';
import { type UserEntity } from '../entities/user.entity';
import { AggregateDomainEvent } from './aggregate-domain.event';

interface UserAggregateRetrievedEventProps {
  aggregateId: string;
  user: UserEntity;
  addresses: AddressEntity[];
}

export class UserAggregateRetrievedEvent extends AggregateDomainEvent {
  public readonly user: UserEntity;
  public readonly addresses: AddressEntity[];
  constructor({ user, addresses, aggregateId }: UserAggregateRetrievedEventProps) {
    super(aggregateId);
    this.user = user;
    this.addresses = addresses;
  }
}
