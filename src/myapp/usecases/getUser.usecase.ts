import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { DomainAggregateEventDispatcher } from '@/core/domain/events/domain-aggregate-dispatcher.event';
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
          statusCode: 400,
        });
      }

      const userAggregate = UserAggregate.fromData({
        email: userModel.email,
        name: userModel.name,
        addresses: userModel.addresses,
        status: userModel.status,
        aggregateId: userModel.aggregateId,
      });

      const domainEvents = userAggregate.getDomainEvents();

      for (const event of domainEvents) {
        DomainAggregateEventDispatcher.dispatch(event);
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
