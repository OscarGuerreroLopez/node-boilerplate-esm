import { type UserEntity } from '@/core/domain/user/entities/user.entity';
import { Status } from '@/core/types/user';
import { type UserMongoRepository } from '@/infra/mongoRepositories/user.repository';
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

export const makeMailFakeService = (userMongoRepository: UserMongoRepository): MailFakeService => {
  const mailFakeService: MailFakeService = async ({ entityId, user }): Promise<void> => {
    await fakeAsyncDelay();

    const email = user.getEmail().value;
    const userName = user.getName().value;
    const emailStatus = user.getEmailStatus().value;

    if (emailStatus === Status.VERIFIED || emailStatus === Status.BLOCKED) {
      return;
    }

    if (email === 'hola@hola.com') {
      user.changeEmailStatus(Status.BLOCKED);
      logger.warn(`[ MAIL SERVICE ${entityId}] email ${email} is high risk, check it please`, logMeta);
    } else {
      user.changeEmailStatus(Status.VERIFIED);
      logger.info(`[ MAIL SERVICE ${entityId} ] Result for email ${email} all good`, logMeta);
    }

    await userMongoRepository.updateUserByEntityId(entityId, {
      emailStatus: user.getEmailStatus().value,
    });

    logger.info(`[ MAIL SERVICE ${entityId} ] succesfully updated emailStatus for ${userName}. `, logMeta);
  };

  return mailFakeService;
};
