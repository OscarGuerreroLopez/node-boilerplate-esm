import { logger } from '@/shared/logger';
import { type MongoDatabase } from '@/core/types/database';
import { type Db, MongoClient, MongoServerError } from 'mongodb';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

export const TestConnection = ((): MongoDatabase => {
  let mongoClient: MongoClient;
  let db: Db;

  const createConnection = async (): Promise<void> => {
    try {
      const replSet = await MongoMemoryReplSet.create({
        replSet: { storageEngine: 'wiredTiger' },
        binary: { version: '4.2.2' },
      });

      const replicaUri = replSet.getUri();
      logger.info(`DB will be located at ${replicaUri}`, {
        service: 'boilerplate',
        file: 'testConnection.ts',
        function: 'createConnection',
        code: '',
      });

      mongoClient = new MongoClient(replicaUri, {
        maxPoolSize: 2,
        minPoolSize: 1,
      });
      await mongoClient.connect();
      db = mongoClient.db('memoryDB');
      logger.info('memoryDB activated', {
        service: 'boilerplate',
        file: 'testConnection.ts',
        function: 'createConnection',
        code: '',
      });
    } catch (error) {
      if (error instanceof MongoServerError) {
        logger.error(`Error connecting to the DB server: ${error instanceof Error ? error.message : JSON.stringify(error)}`, {
          service: 'USER',
          file: 'testConnection.ts',
          function: 'createConnection',
          code: '',
        });
      }
      throw error;
    }
  };

  return {
    getConnection: async () => {
      if (db == null) {
        await createConnection();
      }
      return db;
    },
    closeConnection: async () => {
      if (mongoClient != null) {
        await mongoClient.close();
      }
    },
    checkConnection: async () => {
      if (db == null) {
        await createConnection();
      }

      return db.databaseName;
    },
    getCollection: async (collectionName: string) => {
      if (db == null) {
        await createConnection();
      }
      return db.collection(collectionName);
    },
    getClient: async () => {
      if (mongoClient != null) {
        return mongoClient;
      }

      throw new Error('mongoClient is not defined');
    },
  };
})();
