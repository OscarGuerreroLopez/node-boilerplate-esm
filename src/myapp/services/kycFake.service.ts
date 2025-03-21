import { Status } from '@/core/types/user';
import { logger } from '@/shared/logger';

const logMeta = {
  file: 'src/myapp/services/kycFake.service.ts',
  service: 'playground',
  code: '',
};

export const kycFakeService = async (name: string, status: Status, entityId: string): Promise<void> => {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log('@@@ fake await');
      resolve('ok');
    }, 5000),
  );

  if (status === Status.VERIFIED) {
    return;
  }

  if (name === 'dummy') {
    logger.warn(`[ KYC SERVICE ${entityId} ] Name cannot be "dummy"`, logMeta);
  } else {
    logger.info(`[ KYC SERVICE ${entityId} ] Result for name ${name} all good`, logMeta);
  }
};
