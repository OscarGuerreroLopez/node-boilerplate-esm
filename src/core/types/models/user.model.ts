import { type Address } from '../user';

export interface AddressWithEntityId extends Address {
  entityId: string;
}

export interface IUserModel {
  _id?: string;
  name: string;
  email: string;
  addresses: AddressWithEntityId[];
  createdAt?: Date;
  updatedAt?: Date;
  aggregateId: string;
}
