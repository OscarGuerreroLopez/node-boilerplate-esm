import { type Address } from '../user';

export interface AddressWithAggregateId extends Address {
  entityId: string;
}

export interface IUserModel {
  _id?: string;
  name: string;
  email: string;
  addresses: AddressWithAggregateId[];
  createdAt?: Date;
  updatedAt?: Date;
  aggregateId: string;
}
