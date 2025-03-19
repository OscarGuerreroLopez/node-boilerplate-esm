import { type IAddressModel, type IUserModel } from '@/core/types/models/user.model';

export class UserModel implements IUserModel {
  public name: string;
  public email: string;
  public entityId: string;
  public addresses: IAddressModel[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    name,
    email,
    entityId,
    addresses,
    createdAt,
    updatedAt,
  }: {
    name: string;
    email: string;
    entityId: string;
    addresses: IAddressModel[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.name = name;
    this.email = email;
    this.entityId = entityId;
    this.addresses = addresses;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
