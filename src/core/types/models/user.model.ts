import { type Status } from '../user';

export interface BaseModel {
  createdAt?: Date;
  updatedAt?: Date;
}

export type MongoModel = BaseModel & { _id?: string };
export type SqlModel = BaseModel & { id?: string };

export interface IAddressModel {
  street: string;
  city: string;
  country: string;
  status: Status;
  entityId: string;
}

export interface IUserModel {
  name: string;
  email: string;
  status: Status;
  addresses: IAddressModel[];
  kycStatus: Status;
  emailStatus: Status;
  entityId: string;
}

export type IMongoUserModel = IUserModel & MongoModel & { _id?: string };
export type ISqlUserModel = IUserModel & SqlModel & { id?: string };
export type IMongoAddressModel = IAddressModel & MongoModel & { _id?: string };
export type ISqlAddressModel = IAddressModel & SqlModel & { id?: string };
