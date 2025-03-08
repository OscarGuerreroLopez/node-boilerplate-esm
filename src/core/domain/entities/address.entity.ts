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

  public static create(street: string, city: string, country: string): AddressEntity {
    const streetVo = AddressVo.create(street);
    const cityVo = AddressVo.create(city);
    const countryVo = AddressVo.create(country);

    const address = new AddressEntity({ street: streetVo, city: cityVo, country: countryVo });

    address.addDomainEvent(new AddAddressEvent(address.entityId, cityVo.value, countryVo.value, streetVo.value));
    return address;
  }
}
