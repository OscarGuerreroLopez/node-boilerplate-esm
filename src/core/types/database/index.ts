import { type Collection, type Db, type MongoClient } from 'mongodb';

export interface MongoDatabase {
  getConnection: () => Promise<Db>;
  closeConnection: () => Promise<void>;
  checkConnection: () => Promise<string>;
  getCollection: (collectionName: string) => Promise<Collection<Document>>;
  getClient: () => Promise<MongoClient>;
}
