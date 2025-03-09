import { type Address } from '../user';

export interface IUserModel {
  _id?: string;
  name: string;
  email: string;
  addresses: Address[];
  createdAt?: Date;
  updatedAt?: Date;
}
