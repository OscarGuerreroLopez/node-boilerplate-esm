import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { BaseError } from '@/core/errors/base.error';
import { type GetUserUsecase, type MakeGetUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';

export const makeGetUserUsecase: MakeGetUser = (userMongoRepository) => {
  const getUserUsecase: GetUserUsecase = async (entityId, code) => {
    try {
      const userModel = await userMongoRepository.getUserByEntityId(entityId);

      if (userModel?.email == null || userModel?.name == null) {
        throw WarnError.notFound(`User with entityId ${entityId} not found`);
      }

      const { email, name, addresses, status, entityId: userEntityId, kycStatus, emailStatus } = userModel;

      const userAggregate = UserAggregate.fromData({
        email,
        name,
        addresses,
        status,
        entityId: userEntityId,
        kycStatus,
        emailStatus,
      });

      const domainEvents = userAggregate.getDomainEvents();

      for (const event of domainEvents) {
        DomainEventDispatcher.dispatch(event);
      }

      return { user: userAggregate, id: userModel._id };
    } catch (error) {
      logger.error(error instanceof Error ? error.message : JSON.stringify(error), {
        file: 'src/myapp/usecases/addUser.usecase.ts',
        service: 'playground',
        code: code ?? 'no code',
      });
      throw new WarnError({
        message: 'cannot get user, check logs',
        statusCode: error instanceof BaseError ? error.statusCode : 400,
      });
    }
  };

  return getUserUsecase;
};
