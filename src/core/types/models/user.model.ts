import { type Status, type Address } from '../user';

export interface IUserModel {
  _id?: string;
  name: string;
  email: string;
  status?: Status;
  addresses: Address[];
  createdAt?: Date;
  updatedAt?: Date;
  aggregateId: string;
}
