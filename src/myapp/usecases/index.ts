import { userRepository } from '@/infra/repositories';
import { makeAddUserUsecase } from './addUser.usecase';

export const addUserUsecase = makeAddUserUsecase(userRepository);
