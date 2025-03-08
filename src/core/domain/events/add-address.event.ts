import { DomainEvent } from './domain.event';

export class AddAddressEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly city: string,
    public readonly country: string,
    public readonly street: string,
  ) {
    super(aggregateId);
  }
}
