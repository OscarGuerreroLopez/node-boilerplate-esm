import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { type MakeUpdateUser, type UpdateUserUsecase } from '@/core/types/user/usecases';
import { type IAddressModel } from '@/core/types/models/user.model';
import { Status } from '@/core/types/user';
import { logger } from '@/shared/logger';

export const makeUpdateUserUsecase: MakeUpdateUser = (userRepository): UpdateUserUsecase => {
  const updateUserUsecase: UpdateUserUsecase = async ({ user, identifier, code }) => {
    try {
      let userModel;
      let userStatus;

      if (user.name != null || user.email != null) {
        userStatus = Status.PENDING;
      } else {
        userStatus = user.status;
      }

      const userToUpdate = {
        name: user.name,
        email: user.email,
        status: userStatus,
        addresses: user.addresses?.map((address) => {
          return {
            street: address.street,
            city: address.city,
            country: address.country,
            status: address.status ?? Status.PENDING,
          };
        }) as IAddressModel[],
      };

      if (identifier.type === 'id') {
        userModel = await userRepository.updateUserById(identifier.value, userToUpdate);
      } else {
        userModel = await userRepository.updateUserByEntityId(identifier.value, userToUpdate);
      }

      if (userModel == null) {
        throw WarnError.notFound('User');
      }

      const userAggregate = UserAggregate.fromData({
        email: userModel.email,
        name: userModel.name,
        addresses: userModel.addresses,
        status: userModel.status,
        entityId: userModel.entityId,
      });

      const userAggregatedEvents = [...userAggregate.getDomainEvents()];

      for (const event of userAggregatedEvents) {
        DomainEventDispatcher.dispatch(event);
      }

      return { user: userAggregate, id: userModel._id };
    } catch (error) {
      logger.error(error instanceof Error ? error.message : JSON.stringify(error), {
        file: 'src/myapp/usecases/updateUser.usecase.ts',
        service: 'playground',
        code: code ?? 'no code',
      });
      throw new WarnError({
        message: 'cannot add user, check logs',
        statusCode: 400,
      });
    }
  };

  return updateUserUsecase;
};
