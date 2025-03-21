import { type IUserModel } from '@/core/types/models/user.model';
import { type Address } from '@/core/types/user';

export class UserModel implements IUserModel {
  public name: string;
  public email: string;
  public aggregateId: string;
  public addresses: Address[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    name,
    email,
    aggregateId,
    addresses,
    createdAt,
    updatedAt,
  }: {
    name: string;
    email: string;
    aggregateId: string;
    addresses: Address[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.name = name;
    this.email = email;
    this.aggregateId = aggregateId;
    this.addresses = addresses;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
