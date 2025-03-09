import { type UserEntity } from '@/core/domain/entities/user.entity';
import { type IUserModel } from '../models/user.model';

export interface IUserRepository {
  addUser: (user: IUserModel) => Promise<UserEntity>;
  getUserById: (id: string) => Promise<UserEntity | null>;
  getUserByEmail: (email: string) => Promise<UserEntity | null>;
}
