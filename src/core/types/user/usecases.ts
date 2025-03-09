import { type UserRepository } from '@/infra/repositories/user.repository';
import { type User } from '.';

export type AddUserUsecase = (addUserParams: { user: User; code: string }) => Promise<User>;
export type MakeAddUser = (userRepository: UserRepository) => AddUserUsecase;
