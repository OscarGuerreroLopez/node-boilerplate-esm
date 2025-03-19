import { type Status } from '../user';

export interface IAddressModel {
  street: string;
  city: string;
  country: string;
  status?: Status;
  entityId?: string;
}

export interface IUserModel {
  _id?: string;
  name: string;
  email: string;
  status?: Status;
  addresses: IAddressModel[];
  createdAt?: Date;
  updatedAt?: Date;
  entityId: string;
}
