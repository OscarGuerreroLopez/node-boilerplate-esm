import { logger } from '@/shared/logger';

export const kycFakeService = async (name: string, entityId: string): Promise<void> => {
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (name === 'dummy') {
        logger.info(`[ KYC SERVICE ${entityId} ] Name cannot be "dummy"`, {
          file: 'src/myapp/services/kyc.service.ts',
          service: 'playground',
          code: '',
        });
        reject(new Error('[ KYC SERVICE ] Name cannot be "dummy"'));
      } else {
        logger.info(`[ KYC SERVICE ${entityId} ] Result for name ${name} all good`, {
          file: 'src/myapp/services/kyc.service.ts',
          service: 'playground',
          code: '',
        });
        resolve(`[ KYC SERVICE ] Result for name ${name} all good`);
      }
    }, 5000),
  );
};
