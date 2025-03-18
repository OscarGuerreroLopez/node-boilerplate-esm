import { logger } from '@/shared/logger';

export const mailFakeService = async (email: string, aggregateId: string): Promise<void> => {
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (email === 'hola@hola.com') {
        logger.warn(`[ MAIL SERVICE ${aggregateId}] email ${email} is high risk, check it please`, {
          file: 'src/myapp/services/mailFakeService',
          service: 'playground',
          code: '',
        });
        reject(new Error(`[ MAIL SERVICE] email ${email} is high risk, check it please`));
      } else {
        logger.info(`[ MAIL SERVICE ${aggregateId} ] Result for email ${email} all good`, {
          file: 'src/myapp/services/mailFakeService',
          service: 'playground',
          code: '',
        });
        resolve(`[ MAIL SERVICE] Result for email ${email} all good`);
      }
    }, 3000),
  );
};
