import { type IMongoUserModel } from '@/core/types/models/user.model';
import { BaseRepository } from './base.repository';
import { type IUserRepository } from '@/core/types/repositories/user.repository';
import { Status } from '@/core/types/user';

export class UserMongoRepository extends BaseRepository<IMongoUserModel> implements IUserRepository {
  protected async createIndexes(): Promise<void> {
    await this._collection.createIndex([{ userId: 1, email: 1 }, { entityId: -1 }], { unique: true, background: true });
  }

  async getUserById(id: string): Promise<IMongoUserModel | null> {
    const userModel = await this.findById(id);
    return userModel;
  }

  async getUserByEmail(email: string): Promise<IMongoUserModel | null> {
    const userModel = await this.findOne({ email });
    return userModel;
  }

  async getUserByEntityId(entityId: string): Promise<IMongoUserModel | null> {
    const userModel = await this.findOne({ entityId });
    return userModel;
  }

  async addUser(user: IMongoUserModel): Promise<IMongoUserModel> {
    user.status = Status.PENDING;
    user.kycStatus = Status.PENDING;
    user.emailStatus = Status.PENDING;

    user.addresses = user.addresses.map((address) => {
      address.status = Status.PENDING;
      return address;
    });

    const userModel = await this.insert(user);
    return userModel;
  }

  async updateUserByEmail(email: string, values: Partial<IMongoUserModel>): Promise<IMongoUserModel | null> {
    const userModel = await this.updateOne({ email }, values);
    return userModel;
  }

  async updateUserById(id: string, values: Partial<IMongoUserModel>): Promise<IMongoUserModel | null> {
    const userModel = await this.updateOne({ _id: id }, values);
    return userModel;
  }

  async updateUserByEntityId(entityId: string, values: Partial<IMongoUserModel>): Promise<IMongoUserModel | null> {
    const userModel = await this.updateOne({ entityId }, values);
    return userModel;
  }
}
