import { removeKeys } from '@/shared/helpers/remove-keys';
import { removeUndefinedDeep } from '@/shared/helpers/remove-undefined';
import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> {
  protected _db: PrismaClient;
  protected _model: any;

  constructor(modelName: keyof PrismaClient) {
    this._db = new PrismaClient();
    this._model = this._db[modelName];
  }

  protected async findOne(where: Partial<T>): Promise<T | null> {
    const result = await this._model.findFirst({ where });
    return result ?? null;
  }

  protected async findById(id: string): Promise<T | null> {
    const result = await this._model.findUnique({ where: { id } });
    return result ?? null;
  }

  protected async deleteOne(where: Partial<T>): Promise<boolean> {
    const result = await this._model.deleteMany({ where });
    return result.count > 0;
  }

  protected async findAll(page: number, pageSize: number): Promise<T[]> {
    const result = await this._model.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return result ?? null;
  }

  protected async insert(data: Partial<T>): Promise<T> {
    const result = await this._model.create({ data });
    return result ?? null;
  }

  protected async updateOne(where: Partial<T>, data: Partial<T>): Promise<NonNullable<T> | null> {
    const doc = await this.findOne(where);

    if (doc == null) {
      return null;
    }

    const cleanValues = removeUndefinedDeep(data);

    const newItem = removeKeys({ ...doc, ...cleanValues }, ['id', 'entityId', 'createdAt', 'updatedAt']);

    const result = await this._model.update({ where, data: { ...newItem } });
    return result ?? null;
  }

  protected abstract transformNestedRelations(data: Partial<T>): Partial<T>;
}
