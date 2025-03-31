import { type ISqlUserModel } from '@/core/types/models/user.model';
import { BaseRepository } from './base.repository';
import { type IUserSqlRepository } from '@/core/types/repositories/user.repository';
import { Status } from '@/core/types/user';

export class UserSqlRepository extends BaseRepository<ISqlUserModel> implements IUserSqlRepository {
  async addUser(user: ISqlUserModel): Promise<ISqlUserModel> {
    user.status = Status.PENDING;
    user.kycStatus = Status.PENDING;
    user.emailStatus = Status.PENDING;
    user.addresses = user.addresses.map((address) => {
      address.status = Status.PENDING;
      return address;
    });

    const transformedData = this.transformNestedRelations(user, 'create');
    return await this.insert(transformedData);
  }

  async updateUserById(id: string, values: Partial<ISqlUserModel>): Promise<ISqlUserModel | null> {
    const transformedData = this.transformNestedRelations(values, 'update');
    const userModel = await this.updateOne({ id }, transformedData);
    return userModel;
  }

  async updateUserByEntityId(entityId: string, values: Partial<ISqlUserModel>): Promise<ISqlUserModel | null> {
    const transformedData = this.transformNestedRelations(values, 'update');
    const userModel = await this.updateOne({ entityId }, transformedData);
    return userModel;
  }

  protected transformNestedRelations(data: Partial<ISqlUserModel>, method: 'create' | 'update'): Partial<ISqlUserModel> {
    if (data.addresses != null && Array.isArray(data.addresses)) {
      if (method === 'create') {
        return {
          ...data,
          addresses: { create: data.addresses } as any, // Explicitly cast to match Prisma format
        };
      } else if (method === 'update') {
        return {
          ...data,
          addresses: {
            deleteMany: {},
            create: data.addresses,
          } as any,
        };
      }
    }
    return data;
  }
}
