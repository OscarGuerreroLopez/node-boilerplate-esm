import { type IUserModel } from '@/core/types/models/user.model';
import { BaseRepository } from './base.repository';
import { type IUserRepository } from '@/core/types/repositories/user.repository';
import { UserEntity } from '@/core/domain/entities/user.entity';
import { AddressEntity } from '@/core/domain/entities/address.entity';

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
  protected async createIndexes(): Promise<void> {
    await this._collection.createIndex({ userId: 1, email: 1 }, { unique: true, background: true });
  }

  toEntity(params: IUserModel): UserEntity {
    if (params?._id == null) {
      throw new Error('missing id');
    }

    const { email, name } = params;

    const userEntity = UserEntity.create({ email, name, id: params._id, addresses: [] });

    for (const address of params.addresses) {
      const addressEntity = AddressEntity.create(address.street, address.city, address.country);
      userEntity.addAddress(addressEntity);
    }

    return userEntity;
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    const userModel = await this.findById(id);
    return userModel != null ? this.toEntity(userModel) : null;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const userModel = await this.findOne({ email });
    return userModel != null ? this.toEntity(userModel) : null;
  }

  async addUser(user: IUserModel): Promise<UserEntity> {
    const userModel = await this.insert(user);
    return this.toEntity(userModel);
  }
}
