import { envs } from '@/core/config/env';
import { logger } from '@/shared/logger';
import { type MongoDatabase } from '@/core/types/database';
import { type Db, MongoClient, type MongoClientOptions } from 'mongodb';

export const LiveConnection = ((): MongoDatabase => {
  let mongoClient: MongoClient;
  let db: Db;

  const createConnection = async (): Promise<void> => {
    try {
      const uri = `mongodb+srv://${envs.MONGO_USER}:${envs.MONGO_PASSWORD}@${envs.MONGO_URL}`;

      const options: MongoClientOptions = {
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
      };

      mongoClient = new MongoClient(uri, options);
      await mongoClient.connect();
      db = mongoClient.db(envs.MONGO_DATABASE);

      logger.info('test Live DB activated', {
        service: 'boilerplate',
        file: 'liveConnection.ts',
        function: 'createConnection',
        code: '',
      });
    } catch (error) {
      logger.error(`Error connecting to the DB server: ${error instanceof Error ? error.message : JSON.stringify(error)}`, {
        service: 'USER',
        file: 'liveConnection.ts',
        function: 'createConnection',
        code: '',
      }); // special case for some reason

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
    getCollection: async (collectionName: string) => {
      if (db == null) {
        await createConnection();
      }
      return db.collection(collectionName);
    },
    checkConnection: async () => {
      if (db == null) {
        await createConnection();
      }

      return db.databaseName;
    },
    closeConnection: async () => {
      if (mongoClient != null) {
        await mongoClient.close();
        logger.info('accounts DB closed', {
          service: 'boilerplate',
          file: 'liveConnection.ts',
          function: 'closeConnection',
          code: '',
        });
      }
    },
    getClient: async () => {
      if (mongoClient != null) {
        return mongoClient;
      }

      throw new Error('mongoClient is not defined');
    },
  };
})();
