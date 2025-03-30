import { PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> {
  protected _db: PrismaClient;
  protected _model: any;

  constructor(modelName: keyof PrismaClient) {
    this._db = new PrismaClient();
    this._model = this._db[modelName];
  }

  /**
   * Find one record by conditions.
   */
  async findOne(where: Partial<T>): Promise<T | null> {
    return this._model.findFirst({ where });
  }

  /**
   * Find a record by ID.
   */
  async findById(id: string): Promise<T | null> {
    return this._model.findUnique({ where: { id } });
  }

  /**
   * Insert a new record.
   */
  async insert(data: Partial<T>): Promise<T> {
    const transformedData = this.transformNestedRelations(data);
    return this._model.create({
      data: transformedData,
    });
  }

  /**
   * Delete one record by conditions.
   */
  async deleteOne(where: Partial<T>): Promise<boolean> {
    const result = await this._model.deleteMany({ where });
    return result.count > 0;
  }

  /**
   * Find all records with pagination.
   */
  async findAll(page: number, pageSize: number): Promise<T[]> {
    return this._model.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  /**
   * Update one record by conditions.
   */
  async updateOne(where: Partial<T>, data: Partial<T>): Promise<T | null> {
    return this._model.update({ where, data }).catch(() => null);
  }

  transformNestedRelations(data: Partial<T>): Partial<T> {
    const transformedData = { ...data };

    // Handle `addresses`
    if ('addresses' in transformedData && Array.isArray(transformedData.addresses)) {
      transformedData.addresses = {
        create: transformedData.addresses,
      };
    }

    return transformedData;
  }
}
