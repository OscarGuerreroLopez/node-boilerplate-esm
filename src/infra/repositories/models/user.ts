import { type AddressWithAggregateId, type IUserModel } from '@/core/types/models/user.model';

export class UserModel implements IUserModel {
  public name: string;
  public email: string;
  public aggregateId: string;
  public addresses: AddressWithAggregateId[];
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
    addresses: AddressWithAggregateId[];
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
