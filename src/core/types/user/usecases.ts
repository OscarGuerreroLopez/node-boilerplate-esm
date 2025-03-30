import { type UserRepository } from '@/infra/repositories/user.repository';
import { type UserSqlRepository } from '@/infra/sqlRepositories/user.repository';
import { type AddUserDto } from '@/core/dtos/addUser.dto';
import { type UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { type Identifier } from '../common';
import { type UpdateUserDto } from '@/core/dtos/updateUser.dto';

export interface AddUserUsecaseResponse {
  user: UserAggregate;
  id?: string;
}

export type AddUserUsecase = (addUserParams: { user: AddUserDto; code: string }) => Promise<AddUserUsecaseResponse>;
export type MakeAddUser = (userRepository: UserRepository, userSqlRepository: UserSqlRepository) => AddUserUsecase;

export type GetUserUsecase = (id: string, code: string) => Promise<AddUserUsecaseResponse>;
export type MakeGetUser = (userRepository: UserRepository) => GetUserUsecase;

export type UpdateUserUsecase = (updateUserParams: {
  user: Partial<UpdateUserDto>;
  identifier: Identifier;
  code: string;
}) => Promise<AddUserUsecaseResponse>;
export type MakeUpdateUser = (userRepository: UserRepository) => UpdateUserUsecase;
