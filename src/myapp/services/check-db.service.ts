import { type MongoDatabase } from '@/core/types/database';

export const makeChecMongoDataBase = (database: MongoDatabase): (() => Promise<string>) => {
  const checkConnection = async (): Promise<string> => {
    return await database.checkConnection();
  };

  return checkConnection;
};
