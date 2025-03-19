import { Entity } from '../../entities/entity';
import { AddressVo } from '../../value-objects/address';
import { AddressRegisteredEvent } from '../events/address-register.event';
import { UserStatusVo } from '../../value-objects/status';
import { type Status } from '@/core/types/user';

interface AddressProps {
  street: AddressVo;
  city: AddressVo;
  country: AddressVo;
  status: UserStatusVo;
}

export class AddressEntity extends Entity<AddressProps> {
  private constructor(props: AddressProps, entityId?: string) {
    super(props, entityId);
  }

  public static create({ street, city, country }: { street: string; city: string; country: string }, entityId?: string): AddressEntity {
    const streetVo = AddressVo.create(street);
    const cityVo = AddressVo.create(city);
    const countryVo = AddressVo.create(country);
    const statusVo = UserStatusVo.create();

    const address = new AddressEntity({ street: streetVo, city: cityVo, country: countryVo, status: statusVo }, entityId);

    address.addDomainEvent(
      new AddressRegisteredEvent({ entityId: address.entityId, city: cityVo.value, country: countryVo.value, street: streetVo.value }),
    );
    return address;
  }

  public static fromData(data: { street: string; city: string; country: string; status?: Status; entityId?: string }): AddressEntity {
    const streetVo = AddressVo.create(data.street);
    const cityVo = AddressVo.create(data.city);
    const countryVo = AddressVo.create(data.country);
    const statusVo = UserStatusVo.create(data.status);
    return new AddressEntity({ street: streetVo, city: cityVo, country: countryVo, status: statusVo }, data.entityId);
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

  public getStatus(): UserStatusVo {
    return this.props.status;
  }

  public changeStreet(street: string): this {
    const streetVo = AddressVo.create(street);
    if (this.props.street.equals(streetVo)) {
      return this;
    }

    this.props.street = streetVo;
    return this;
  }

  public changeCity(city: string): this {
    const cityVo = AddressVo.create(city);
    if (this.props.city.equals(cityVo)) {
      return this;
    }

    this.props.city = cityVo;
    return this;
  }

  public changeCountry(country: string): this {
    const countryVo = AddressVo.create(country);
    if (this.props.country.equals(countryVo)) {
      return this;
    }

    this.props.country = countryVo;
    return this;
  }

  public changeStatus(status: Status): this {
    const statusVo = UserStatusVo.create(status);
    if (this.props.status.equals(statusVo)) {
      return this;
    }

    this.props.status = statusVo;
    return this;
  }
}
