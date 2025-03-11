import { AddAddressEvent } from '../events/add-address.event';
import { AddressVo } from '../value-objects/address';
import { Entity } from './entity';

interface AddressProps {
  street: AddressVo;
  city: AddressVo;
  country: AddressVo;
}

export class AddressEntity extends Entity<AddressProps> {
  private constructor(props: AddressProps, entityId?: string) {
    super(props, entityId);
  }

  public static create({ street, city, country }: { street: string; city: string; country: string }, entityId?: string): AddressEntity {
    const streetVo = AddressVo.create(street);
    const cityVo = AddressVo.create(city);
    const countryVo = AddressVo.create(country);

    const address = new AddressEntity({ street: streetVo, city: cityVo, country: countryVo }, entityId);

    address.addDomainEvent(
      new AddAddressEvent({ entityId: address.entityId, city: cityVo.value, country: countryVo.value, street: streetVo.value }),
    );
    return address;
  }

  public getStreet(): AddressVo {
    return this.props.street;
  }

  public getCity(): AddressVo {
    return this.props.city;
  }

  public getCountry(): AddressVo {
    return this.props.country;
  }
}
