import { DomainEvent } from './domain.event';

interface AddAddressEventProps {
  entityId: string;
  city: string;
  country: string;
  street: string;
}

export class AddAddressEvent extends DomainEvent {
  public readonly city: string;
  public readonly country: string;
  public readonly street: string;

  constructor({ entityId, city, country, street }: AddAddressEventProps) {
    super(entityId);
    this.city = city;
    this.country = country;
    this.street = street;
  }
}
