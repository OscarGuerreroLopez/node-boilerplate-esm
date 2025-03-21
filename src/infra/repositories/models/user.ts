import { type IAddressModel, type IUserModel } from '@/core/types/models/user.model';
import { type Status } from '@/core/types/user';

export class UserModel implements IUserModel {
  public name: string;
  public email: string;
  public entityId: string;
  public addresses: IAddressModel[];
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
    addresses: IAddressModel[];
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
