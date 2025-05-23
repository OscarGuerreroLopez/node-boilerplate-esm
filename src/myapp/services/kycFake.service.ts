import { type UserEntity } from '@/core/domain/user/entities/user.entity';
import { Status } from '@/core/types/user';
import { type UserMongoRepository } from '@/infra/mongoRepositories/user.repository';
import { type UserSqlRepository } from '@/infra/sqlRepositories/user.repository';
import { logger } from '@/shared/logger';

const logMeta = {
  file: 'src/myapp/services/kycFake.service.ts',
  service: 'playground',
  code: '',
};

const fakeAsyncDelay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('@@@ fake await');
};

type KycFakeService = (params: { user: UserEntity; entityId: string }) => Promise<void>;

export const makeKycServiceFake = (userMongoRepository: UserMongoRepository, userSqlRepository: UserSqlRepository): KycFakeService => {
  const kycFakeService: KycFakeService = async ({ entityId, user }): Promise<void> => {
    await fakeAsyncDelay();

    const userKycStatus = user.getKycStatus().value;
    const userName = user.getName().value;

    if (userKycStatus === Status.VERIFIED || userKycStatus === Status.BLOCKED) {
      return;
    }

    if (userName === 'dummy') {
      user.changeKycStatus(Status.BLOCKED);
      logger.warn(`[ KYC SERVICE ${entityId} ] Name cannot be "dummy"`, logMeta);
    } else {
      user.changeKycStatus(Status.VERIFIED);
      logger.info(`[ KYC SERVICE ${entityId} ] Result for name ${userName} all good`, logMeta);
    }

    await userMongoRepository.updateUserByEntityId(entityId, {
      kycStatus: user.getKycStatus().value,
    });

    await userSqlRepository.updateUserByEntityId(entityId, {
      kycStatus: user.getKycStatus().value,
    });

    logger.info(`[ KYC SERVICE ${entityId} ] succesfully updated  kycStatus for ${userName}. `, logMeta);
  };

  return kycFakeService;
};
