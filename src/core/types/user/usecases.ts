import { type UserMongoRepository } from '@/infra/mongoRepositories/user.repository';
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
export type MakeAddUser = (userMongoRepository: UserMongoRepository, userSqlRepository: UserSqlRepository) => AddUserUsecase;

export type GetUserUsecase = (entity: string, code: string) => Promise<AddUserUsecaseResponse>;
export type MakeGetUser = (userRepository: UserMongoRepository) => GetUserUsecase;

export type UpdateUserUsecase = (updateUserParams: {
  user: Partial<UpdateUserDto>;
  identifier: Identifier;
  code: string;
}) => Promise<AddUserUsecaseResponse>;
export type MakeUpdateUser = (userMongoRepository: UserMongoRepository, userSqlRepository: UserSqlRepository) => UpdateUserUsecase;
