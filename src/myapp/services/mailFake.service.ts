import { type UserEntity } from '@/core/domain/user/entities/user.entity';
import { Status } from '@/core/types/user';
import { type UserRepository } from '@/infra/repositories/user.repository';
import { logger } from '@/shared/logger';

const logMeta = {
  file: 'src/myapp/services/mailFakeService',
  service: 'playground',
  code: '',
};

const fakeAsyncDelay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('@@@ fake await');
};

type MailFakeService = (params: { user: UserEntity; entityId: string }) => Promise<void>;

export const makeMailFakeService = (userRepository: UserRepository): MailFakeService => {
  const mailFakeService: MailFakeService = async ({ entityId, user }): Promise<void> => {
    await fakeAsyncDelay();

    const status = user.getStatus().value;
    const email = user.getEmail().value;
    const userName = user.getName().value;

    if (status === Status.VERIFIED) {
      return;
    }

    if (email === 'hola@hola.com') {
      user.changeEmailStatus(Status.BLOCKED);
      logger.warn(`[ MAIL SERVICE ${entityId}] email ${email} is high risk, check it please`, logMeta);
    } else {
      user.changeEmailStatus(Status.VERIFIED);
      logger.info(`[ MAIL SERVICE ${entityId} ] Result for email ${email} all good`, logMeta);
    }

    await userRepository.updateUserByEntityId(entityId, {
      emailStatus: user.getEmailStatus().value,
    });

    logger.info(`[ MAIL SERVICE ${entityId} ] succesfully updated emailStatus for ${userName}. `, logMeta);
  };

  return mailFakeService;
};
