import { type IMongoUserModel, type ISqlUserModel } from '../models/user.model';

export interface IUserRepository {
  addUser: (user: IMongoUserModel) => Promise<IMongoUserModel>;
  getUserById: (id: string) => Promise<IMongoUserModel | null>;
  getUserByEmail: (email: string) => Promise<IMongoUserModel | null>;
  getUserByEntityId: (entityId: string) => Promise<IMongoUserModel | null>;
  updateUserByEmail: (email: string, values: Partial<IMongoUserModel>) => Promise<IMongoUserModel | null>;
  updateUserById: (id: string, values: Partial<IMongoUserModel>) => Promise<IMongoUserModel | null>;
  updateUserByEntityId: (entityId: string, values: Partial<IMongoUserModel>) => Promise<IMongoUserModel | null>;
}

export interface IUserSqlRepository {
  addUser: (user: ISqlUserModel) => Promise<ISqlUserModel>;
  updateUserById: (id: string, values: Partial<ISqlUserModel>) => Promise<ISqlUserModel | null>;
  updateUserByEntityId: (entityId: string, values: Partial<ISqlUserModel>) => Promise<ISqlUserModel | null>;
}
