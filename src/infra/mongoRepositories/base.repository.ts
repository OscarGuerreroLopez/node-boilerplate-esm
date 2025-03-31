/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ObjectId, type Collection } from 'mongodb';
import { Database } from '../mongo';
import { removeUndefinedDeep } from '@/shared/helpers/remove-undefined';
import { removeKeys } from '@/shared/helpers/remove-keys';

export abstract class BaseRepository<T> {
  protected _collection!: Collection;
  private readonly _collectionName: string;

  constructor(collectionName: string) {
    this._collectionName = collectionName;
  }

  protected abstract createIndexes(): Promise<void>;

  protected async initializeCollection(): Promise<void> {
    if (this._collection == null) {
      const db = await Database.getConnection();
      this._collection = db.collection(this._collectionName);
      await this.createIndexes();
    }
  }

  protected async findOne(where: Partial<T>): Promise<NonNullable<T> | null> {
    await this.initializeCollection();

    const result = (await this._collection.findOne(where)) as T;

    return result ?? null;
  }

  protected async findById(id: string): Promise<NonNullable<T> | null> {
    await this.initializeCollection();

    const result = (await this._collection.findOne({
      _id: new ObjectId(id),
    })) as T;

    return result ?? null;
  }

  protected async insert(item: Partial<T>): Promise<NonNullable<T>> {
    await this.initializeCollection();

    item = { ...item, createdAt: new Date(), updatedAt: new Date() };

    const result = await this._collection.insertOne(item, {});

    const insertedDocument = (await this._collection.findOne({
      _id: result.insertedId,
    })) as T;

    if (insertedDocument == null) {
      throw new Error('Inserted document not found');
    }

    return insertedDocument;
  }

  protected async deleteOne(where: Partial<T>): Promise<boolean> {
    await this.initializeCollection();

    const result = await this._collection.deleteOne(where);

    return result.deletedCount === 1;
  }

  protected async findAll(page: number, pageSize: number): Promise<T[]> {
    await this.initializeCollection();

    const skip = (page - 1) * pageSize;

    const result = (await this._collection.find({}).skip(skip).limit(pageSize).toArray()) as unknown as T[];

    return result ?? null;
  }

  protected async updateOne(where: Partial<T>, values: Partial<T>): Promise<NonNullable<T> | null> {
    await this.initializeCollection();

    if (where != null && '_id' in where && typeof where._id === 'string') {
      where = { ...where, _id: new ObjectId(where._id) };
    }

    const doc = await this.findOne(where);

    if (doc == null) {
      return null;
    }

    const cleanValues = removeUndefinedDeep(values);

    const newItem = removeKeys({ ...doc, ...cleanValues, updatedAt: new Date() }, ['createdAt']) as unknown as T;

    await this._collection.updateOne(
      { ...where },
      { $set: newItem as Partial<T> },
      {
        upsert: false,
      },
    );

    return newItem ?? null;
  }
}
