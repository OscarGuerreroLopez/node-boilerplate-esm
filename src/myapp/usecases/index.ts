import { userRepository } from '@/infra/repositories';
import { makeAddUserUsecase } from './addUser.usecase';
import { makeGetUserUsecase } from './getUser.usecase';
import { makeUpdateUserUsecase } from './updateUser.usecase';

export const addUserUsecase = makeAddUserUsecase(userRepository);
export const getUserUsecase = makeGetUserUsecase(userRepository);
export const updateUserUsecase = makeUpdateUserUsecase(userRepository);
