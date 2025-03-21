import { Status } from '@/core/types/user';
import { logger } from '@/shared/logger';

const logMeta = {
  file: 'src/myapp/services/mailFakeService',
  service: 'playground',
  code: '',
};

export const mailFakeService = async (email: string, status: Status, entityId: string): Promise<void> => {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log('@@@ fake await');
      resolve('ok');
    }, 5000),
  );

  if (status === Status.VERIFIED) {
    return;
  }

  if (email === 'hola@hola.com') {
    logger.warn(`[ MAIL SERVICE ${entityId}] email ${email} is high risk, check it please`, logMeta);
  } else {
    logger.info(`[ MAIL SERVICE ${entityId} ] Result for email ${email} all good`, logMeta);
  }
};
