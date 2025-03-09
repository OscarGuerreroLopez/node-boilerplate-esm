import { type User } from '.';

export type AddUserUsecase = (addUserParams: { user: User; code: string }) => Promise<User>;
export type MakeAddUser = () => AddUserUsecase;
