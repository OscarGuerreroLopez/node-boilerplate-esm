import { type UserRepository } from '@/infra/repositories/user.repository';
import { type AddUserDto } from '@/core/dtos/addUser.dto';
import { type UserAggregate } from '@/core/domain/user/entities/user.aggregate';

export interface AddUserUsecaseResponse {
  user: UserAggregate;
  id?: string;
}

export type AddUserUsecase = (addUserParams: { user: AddUserDto; code: string }) => Promise<AddUserUsecaseResponse>;
export type MakeAddUser = (userRepository: UserRepository) => AddUserUsecase;

export type GetUserUsecase = (id: string, code: string) => Promise<AddUserUsecaseResponse>;
export type MakeGetUser = (userRepository: UserRepository) => GetUserUsecase;
