import { DomainEvent } from './domain.event';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
    public readonly name: string,
  ) {
    super(aggregateId);
  }
}
