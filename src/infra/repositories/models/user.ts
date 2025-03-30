import { type IMongoAddressModel, type IMongoUserModel } from '@/core/types/models/user.model';
import { type Status } from '@/core/types/user';

export class UserModel implements IMongoUserModel {
  public name: string;
  public email: string;
  public entityId: string;
  public addresses: IMongoAddressModel[];
  public kycStatus: Status;
  public status: Status;
  public emailStatus: Status;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    name,
    email,
    entityId,
    addresses,
    kycStatus,
    status,
    emailStatus,
    createdAt,
    updatedAt,
  }: {
    name: string;
    email: string;
    entityId: string;
    addresses: IMongoAddressModel[];
    kycStatus: Status;
    status: Status;
    emailStatus: Status;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.name = name;
    this.email = email;
    this.entityId = entityId;
    this.addresses = addresses;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.kycStatus = kycStatus;
    this.status = status;
    this.emailStatus = emailStatus;
  }
}
