import { type IObjectLiteral } from '@/core/types/common';
import { removeKeys } from '@/shared/helpers/remove-keys';
import { removeUndefinedDeep } from '@/shared/helpers/remove-undefined';
import { type PrismaClient } from '@prisma/client';
import { SqlDatabase } from '../sql';

export abstract class BaseRepository<T> {
  protected _model: any;
  private readonly _modelName: keyof PrismaClient;

  constructor(modelName: keyof PrismaClient) {
    this._modelName = modelName;
  }

  protected initializeCollection(): void {
    if (this._model == null) {
      const db = SqlDatabase.getConnection();
      this._model = db[this._modelName];
    }
  }

  protected async findOne(where: Partial<T>, include?: IObjectLiteral): Promise<T | null> {
    this.initializeCollection();
    const result = await this._model.findFirst({ where, include });
    return result ?? null;
  }

  protected async findById(id: string): Promise<T | null> {
    this.initializeCollection();
    const result = await this._model.findUnique({ where: { id } });
    return result ?? null;
  }

  protected async deleteOne(where: Partial<T>): Promise<boolean> {
    this.initializeCollection();
    const result = await this._model.deleteMany({ where });
    return result.count > 0;
  }

  protected async findAll(page: number, pageSize: number): Promise<T[]> {
    this.initializeCollection();
    const result = await this._model.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return result ?? null;
  }

  protected async insert(data: Partial<T>): Promise<T> {
    this.initializeCollection();
    const result = await this._model.create({ data });
    return result ?? null;
  }

  protected async updateOne(where: Partial<T>, data: Partial<T>): Promise<NonNullable<T> | null> {
    this.initializeCollection();
    const cleanValues = removeUndefinedDeep(data);

    const newItem = removeKeys({ ...cleanValues }, ['id', 'entityId', 'createdAt', 'updatedAt']);

    const result = await this._model.update({ where, data: newItem });
    return result ?? null;
  }

  protected abstract transformNestedRelations(data: Partial<T>, method: string): Partial<T>;
}
