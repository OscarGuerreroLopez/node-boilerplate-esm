import { type IUserModel } from '@/core/types/models/user.model';
import { BaseRepository } from './base.repository';
import { type IUserRepository } from '@/core/types/repositories/user.repository';

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
    const userModel = await this.insert(user);
    return userModel;
  }
}
