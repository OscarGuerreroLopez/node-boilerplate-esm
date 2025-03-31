import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { type MakeUpdateUser, type UpdateUserUsecase } from '@/core/types/user/usecases';
import { type ISqlAddressModel, type IMongoAddressModel, type IMongoUserModel, type ISqlUserModel } from '@/core/types/models/user.model';
import { Status } from '@/core/types/user';
import { logger } from '@/shared/logger';

export const makeUpdateUserUsecase: MakeUpdateUser = (userMongoRepository, userSqlRepository): UpdateUserUsecase => {
  const updateUserUsecase: UpdateUserUsecase = async ({ user, identifier, code }) => {
    try {
      let userStatus = user.status;
      let kycStatus = user.kycStatus;
      let emailStatus = user.emailStatus;

      if (user.name != null) userStatus = kycStatus = Status.PENDING;

      if (user.email != null) userStatus = emailStatus = Status.PENDING;

      const addresses: IMongoAddressModel[] | ISqlAddressModel[] =
        user.addresses?.map(({ street, city, country }) => {
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

      const userToUpdate: Partial<IMongoUserModel> | Partial<ISqlUserModel> = {
        name: user.name,
        email: user.email,
        status: userStatus,
        kycStatus,
        emailStatus,
        ...(addresses != null && addresses.length > 0 && { addresses }),
      };

      const userMongoModel =
        identifier.type === 'id'
          ? await userMongoRepository.updateUserById(identifier.value, userToUpdate)
          : await userMongoRepository.updateUserByEntityId(identifier.value, userToUpdate);

      if (userMongoModel == null) {
        throw WarnError.notFound(`unable to update user ${user.email}`);
      }

      const userSqlModel =
        identifier.type === 'id'
          ? await userSqlRepository.updateUserById(identifier.value, userToUpdate)
          : await userSqlRepository.updateUserByEntityId(identifier.value, userToUpdate);

      if (userSqlModel == null) {
        throw WarnError.notFound(`unable to update user ${user.email}`);
      }

      const userAggregate = UserAggregate.fromData({
        email: userMongoModel.email,
        name: userMongoModel.name,
        addresses: userMongoModel.addresses,
        status: userMongoModel.status,
        kycStatus: userMongoModel.kycStatus,
        emailStatus: userMongoModel.emailStatus,
        entityId: userMongoModel.entityId,
      });

      const userAggregatedEvents = [...userAggregate.getDomainEvents()];

      for (const event of userAggregatedEvents) {
        DomainEventDispatcher.dispatch(event);
      }

      return { user: userAggregate, id: userMongoModel._id };
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
