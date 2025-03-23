import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { type GetUserUsecase, type MakeGetUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';

export const makeGetUserUsecase: MakeGetUser = (userRepository) => {
  const getUserUsecase: GetUserUsecase = async (id, code) => {
    try {
      const userModel = await userRepository.getUserById(id);

      if (userModel?.email == null || userModel?.name == null) {
        throw new WarnError({
          message: 'User data is incomplete',
          statusCode: 404,
        });
      }

      const userAggregate = UserAggregate.fromData({
        email: userModel.email,
        name: userModel.name,
        addresses: userModel.addresses,
        status: userModel.status,
        entityId: userModel.entityId,
        kycStatus: userModel.kycStatus,
        emailStatus: userModel.emailStatus,
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
        statusCode: 400,
      });
    }
  };

  return getUserUsecase;
};
