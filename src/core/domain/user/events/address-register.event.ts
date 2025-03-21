import { DomainEvent } from '../../events/domain.event';

interface AddressRegisteredEventProps {
  entityId: string;
  city: string;
  country: string;
  street: string;
}

export class AddressRegisteredEvent extends DomainEvent {
  public readonly city: string;
  public readonly country: string;
  public readonly street: string;

  constructor({ entityId, city, country, street }: AddressRegisteredEventProps) {
    super(entityId);
    this.city = city;
    this.country = country;
    this.street = street;
  }
}
