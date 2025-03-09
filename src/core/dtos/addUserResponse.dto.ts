import { type Address, type User } from '@/core/types/user';

export class UserResponseDto {
  id?: string;
  name: string;
  email: string;
  addresses: Address[];

  constructor(user: User) {
    this.name = user.name;
    this.email = user.email;
    this.addresses = user.addresses;
    this.id = user.id;
  }

  public static create(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }
}
