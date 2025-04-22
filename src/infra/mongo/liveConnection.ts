import { envs } from '@/core/config/env';
import { logger } from '@/shared/logger';
import { type MongoDatabase } from '@/core/types/database';
import { type Collection, type Db, MongoClient, type MongoClientOptions } from 'mongodb';

export const LiveConnection = ((): MongoDatabase => {
  let mongoClient: MongoClient;
  let db: Db;

  try {
    const createConnection = async (): Promise<void> => {
      const uri = `mongodb+srv://${envs.MONGO_USER}:${envs.MONGO_PASSWORD}@${envs.MONGO_URL}`;

      const options: MongoClientOptions = {
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
      };

      mongoClient = new MongoClient(uri, options);
      await mongoClient.connect();
      db = mongoClient.db(envs.MONGO_DATABASE);

      logger.info('Live DB activated', {
        service: 'boilerplate',
        file: 'liveConnection.ts',
        function: 'createConnection',
        code: '',
      });
    };

    const getConnection = async (): Promise<Db> => {
      if (db == null) {
        await createConnection();
      }
      return db;
    };
    const getCollection = async (collectionName: string): Promise<Collection<Document>> => {
      if (db == null) {
        await createConnection();
      }
      return db.collection(collectionName);
    };
    const checkConnection = async (): Promise<string> => {
      if (db == null) {
        await createConnection();
      }

      return db.databaseName;
    };
    const closeConnection = async (): Promise<void> => {
      if (mongoClient != null) {
        await mongoClient.close();
        logger.info('accounts DB closed', {
          service: 'boilerplate',
          file: 'liveConnection.ts',
          function: 'closeConnection',
          code: '',
        });
      }
    };
    const getClient = async (): Promise<MongoClient> => {
      if (mongoClient != null) {
        return mongoClient;
      }

      throw new Error('mongoClient is not defined');
    };

    return {
      getConnection,
      closeConnection,
      checkConnection,
      getCollection,
      getClient,
    };
  } catch (error) {
    logger.error(`Error connecting to the DB server: ${error instanceof Error ? error.message : JSON.stringify(error)}`, {
      service: 'boilerplate',
      file: 'liveConnection.ts',
      function: 'createConnection',
      code: '',
    });
    throw error;
  }
})();
