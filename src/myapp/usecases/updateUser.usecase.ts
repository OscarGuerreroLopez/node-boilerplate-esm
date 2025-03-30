import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { type MakeUpdateUser, type UpdateUserUsecase } from '@/core/types/user/usecases';
import { type IMongoAddressModel } from '@/core/types/models/user.model';
import { Status } from '@/core/types/user';
import { logger } from '@/shared/logger';

export const makeUpdateUserUsecase: MakeUpdateUser = (userMongoRepository): UpdateUserUsecase => {
  const updateUserUsecase: UpdateUserUsecase = async ({ user, identifier, code }) => {
    try {
      let userStatus = user.status;
      let kycStatus = user.kycStatus;
      let emailStatus = user.emailStatus;

      if (user.name != null) userStatus = kycStatus = Status.PENDING;

      if (user.email != null) userStatus = emailStatus = Status.PENDING;

      const addresses: IMongoAddressModel[] =
        user.addresses?.map(({ street, city, country, status }) => {
          if (street === undefined || city === undefined || country === undefined) {
            throw new Error('Street, city, and country must be defined in address');
          }
          return {
            street,
            city,
            country,
            status: Status.PENDING,
          };
        }) ?? [];

      const userToUpdate = {
        name: user.name,
        email: user.email,
        status: userStatus,
        kycStatus,
        emailStatus,
        ...(addresses != null && addresses.length > 0 && { addresses }),
      };

      const userModel =
        identifier.type === 'id'
          ? await userMongoRepository.updateUserById(identifier.value, userToUpdate)
          : await userMongoRepository.updateUserByEntityId(identifier.value, userToUpdate);

      if (userModel == null) {
        throw WarnError.notFound(`unable to update user ${user.email}`);
      }

      const userAggregate = UserAggregate.fromData({
        email: userModel.email,
        name: userModel.name,
        addresses: userModel.addresses,
        status: userModel.status,
        kycStatus: userModel.kycStatus,
        emailStatus: userModel.emailStatus,
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
