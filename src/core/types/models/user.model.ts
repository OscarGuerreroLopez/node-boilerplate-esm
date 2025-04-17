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
  kycStatus: Status;
  emailStatus: Status;
  entityId: string;
}

export interface IUserAggregateModel extends IUserModel {
  addresses: IAddressModel[];
}

// TBD: remove & { _id?: string } and & { id?: string } from the models???
export type IMongoUserModel = IUserAggregateModel & MongoModel;
export type ISqlUserModel = IUserAggregateModel & SqlModel;
export type IMongoAddressModel = IAddressModel & MongoModel;
export type ISqlAddressModel = IAddressModel & SqlModel;
