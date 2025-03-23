import { type IUserModel } from '../models/user.model';

export interface IUserRepository {
  addUser: (user: IUserModel) => Promise<IUserModel>;
  getUserById: (id: string) => Promise<IUserModel | null>;
  getUserByEmail: (email: string) => Promise<IUserModel | null>;
  getUserByEntityId: (entityId: string) => Promise<IUserModel | null>;
  updateUserByEmail: (email: string, values: Partial<IUserModel>) => Promise<IUserModel | null>;
  updateUserById: (id: string, values: Partial<IUserModel>) => Promise<IUserModel | null>;
  updateUserByEntityId: (entityId: string, values: Partial<IUserModel>) => Promise<IUserModel | null>;
}
