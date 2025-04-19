import { type UserEntity } from '@/core/domain/user/entities/user.entity';
import { Status } from '@/core/types/user';
import { type UserMongoRepository } from '@/infra/mongoRepositories/user.repository';
import { type UserSqlRepository } from '@/infra/sqlRepositories/user.repository';
import { logger } from '@/shared/logger';

const logMeta = {
  file: 'src/myapp/services/mailFakeService',
  service: 'playground',
  code: '',
};

const fakeAsyncDelay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('@@@ fake await');
};

type MailFakeService = (params: { user: UserEntity; entityId: string }) => Promise<void>;

export const makeMailFakeService = (userMongoRepository: UserMongoRepository, userSqlRepository: UserSqlRepository): MailFakeService => {
  const mailFakeService: MailFakeService = async ({ entityId, user }): Promise<void> => {
    try {
      await fakeAsyncDelay();

      const { emailStatus, email, name: userName } = user.toValue();

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

      await userSqlRepository.updateUserByEntityId(entityId, {
        emailStatus: user.getEmailStatus().value,
      });

      logger.info(`[ MAIL SERVICE ${entityId} ] succesfully updated emailStatus for ${userName}. `, logMeta);
    } catch (error) {
      logger.error(error instanceof Error ? error.message : JSON.stringify(error), logMeta);
    }
  };

  return mailFakeService;
};
