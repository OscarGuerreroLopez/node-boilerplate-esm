import { type IUserModel } from '../models/user.model';

export interface IUserRepository {
  addUser: (user: IUserModel) => Promise<IUserModel>;
  getUserById: (id: string) => Promise<IUserModel | null>;
  getUserByEmail: (email: string) => Promise<IUserModel | null>;
}
