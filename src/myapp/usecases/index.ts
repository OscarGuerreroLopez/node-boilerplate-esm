import { userMongoRepository } from '@/infra/mongoRepositories';
import { makeAddUserUsecase } from './addUser.usecase';
import { makeGetUserUsecase } from './getUser.usecase';
import { makeUpdateUserUsecase } from './updateUser.usecase';
import { userSqlRepository } from '@/infra/sqlRepositories';

export const addUserUsecase = makeAddUserUsecase(userMongoRepository, userSqlRepository);
export const getUserUsecase = makeGetUserUsecase(userMongoRepository);
export const updateUserUsecase = makeUpdateUserUsecase(userMongoRepository, userSqlRepository);
