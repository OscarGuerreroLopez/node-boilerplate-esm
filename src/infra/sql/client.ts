import { type SqlDatabase } from '@/core/types/database';
import { logger } from '@/shared/logger';
import { PrismaClient, type Prisma } from '@prisma/client';

let globalPrisma: PrismaClient | null = null;

export const DbConnection = (url: string): SqlDatabase => {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local';

    const getConnection = (): PrismaClient => {
      if (globalPrisma == null) {
        const properties: Prisma.PrismaClientOptions = {
          datasources: {
            db: {
              url,
            },
          },
          errorFormat: 'pretty' as Prisma.ErrorFormat,
          log: isDevelopment
            ? [
                { level: 'query', emit: 'stdout' },
                { level: 'info', emit: 'stdout' },
                { level: 'warn', emit: 'stdout' },
                { level: 'error', emit: 'stdout' },
              ]
            : [],
        };

        globalPrisma = new PrismaClient(properties);

        process.on('beforeExit', () => {
          void (async () => {
            try {
              await closeConnection();
            } catch (error) {
              console.error('Error during graceful shutdown:', error);
            }
          })();
        });
      }

      return globalPrisma;
    };

    const closeConnection = async (): Promise<void> => {
      if (globalPrisma != null) {
        await globalPrisma.$disconnect();
        globalPrisma = null;
      }
    };

    const healthCheck = async (): Promise<boolean> => {
      try {
        if (globalPrisma == null) {
          throw new Error('Prisma client is not initialized');
        }

        await globalPrisma.$queryRaw`SELECT 1`;
        return true;
      } catch (error) {
        console.error('Database health check failed:', error);
        return false;
      }
    };

    return {
      getConnection,
      closeConnection,
      healthCheck,
    };
  } catch (error) {
    logger.error(`Error connecting to the DB server: ${error instanceof Error ? error.message : JSON.stringify(error)}`, {
      service: 'USER',
      file: 'liveConnection.ts',
      function: 'createConnection',
      code: '',
    });
    throw error;
  }
};
