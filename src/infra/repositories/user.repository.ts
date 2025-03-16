import { type IUserModel } from '@/core/types/models/user.model';
import { BaseRepository } from './base.repository';
import { type IUserRepository } from '@/core/types/repositories/user.repository';
import { Status } from '@/core/types/user';

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
  protected async createIndexes(): Promise<void> {
    await this._collection.createIndex({ userId: 1, email: 1 }, { unique: true, background: true });
  }

  async getUserById(id: string): Promise<IUserModel | null> {
    const userModel = await this.findById(id);
    return userModel;
  }

  async getUserByEmail(email: string): Promise<IUserModel | null> {
    const userModel = await this.findOne({ email });
    return userModel;
  }

  async addUser(user: IUserModel): Promise<IUserModel> {
    if (user.status == null) {
      user.status = Status.PENDING;
    }

    user.addresses = user.addresses.map((address) => {
      address.status = Status.PENDING;
      return address;
    });

    const userModel = await this.insert(user);
    return userModel;
  }
}
