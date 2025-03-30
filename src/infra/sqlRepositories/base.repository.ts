import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> {
  protected _db: PrismaClient;
  protected _model: any;

  constructor(modelName: keyof PrismaClient) {
    this._db = new PrismaClient();
    this._model = this._db[modelName];
  }

  protected async findOne(where: Partial<T>): Promise<T | null> {
    return this._model.findFirst({ where });
  }

  protected async findById(id: string): Promise<T | null> {
    return this._model.findUnique({ where: { id } });
  }

  protected async insert(data: Partial<T>): Promise<T> {
    return this._model.create({ data });
  }

  protected async deleteOne(where: Partial<T>): Promise<boolean> {
    const result = await this._model.deleteMany({ where });
    return result.count > 0;
  }

  protected async findAll(page: number, pageSize: number): Promise<T[]> {
    return this._model.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  protected async updateOne(where: Partial<T>, data: Partial<T>): Promise<T | null> {
    return this._model.update({ where, data }).catch(() => null);
  }

  protected abstract transformNestedRelations(data: Partial<T>): Partial<T>;
}
