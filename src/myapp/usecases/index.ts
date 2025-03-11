import { userRepository } from '@/infra/repositories';
import { makeAddUserUsecase } from './addUser.usecase';
import { makeGetUserUsecase } from './getUser.usecase';

export const addUserUsecase = makeAddUserUsecase(userRepository);
export const getUserUsecase = makeGetUserUsecase(userRepository);
