import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { type MakeUpdateUser, type UpdateUserUsecase } from '@/core/types/user/usecases';
import { type ISqlAddressModel, type IMongoAddressModel, type IMongoUserModel } from '@/core/types/models/user.model';
import { Status } from '@/core/types/user';
import { logger } from '@/shared/logger';
import { userModelFactory } from '@/core/types/models/user.model.factory';
import { BaseError } from '@/core/errors/base.error';

export const makeUpdateUserUsecase: MakeUpdateUser = (userMongoRepository, userSqlRepository): UpdateUserUsecase => {
  const updateUserUsecase: UpdateUserUsecase = async ({ user, identifier, code }) => {
    try {
      let userStatus = user.status;
      let kycStatus = user.kycStatus;
      let emailStatus = user.emailStatus;

      if (user.name != null) userStatus = kycStatus = Status.PENDING;

      if (user.email != null) userStatus = emailStatus = Status.PENDING;

      const addresses: IMongoAddressModel[] | ISqlAddressModel[] =
        user.addresses?.map(({ street, city, country, entityId }) => {
          if (street === undefined || city === undefined || country === undefined) {
            throw new Error('Street, city, and country must be defined in address');
          }
          return {
            street,
            city,
            country,
            status: Status.PENDING,
            entityId: entityId ?? '',
          };
        }) ?? [];

      const userToUpdate = userModelFactory({
        name: user.name,
        email: user.email,
        status: userStatus,
        kycStatus,
        emailStatus,
        entityId: identifier.type === 'entityId' ? identifier.value : undefined,
        ...(addresses != null && addresses.length > 0 && { addresses }),
      });

      const updateMongoPromise =
        identifier.type === 'id'
          ? userMongoRepository.updateUserById(identifier.value, userToUpdate)
          : userMongoRepository.updateUserByEntityId(identifier.value, userToUpdate);

      const updateSqlPromise =
        identifier.type === 'id'
          ? userSqlRepository.updateUserById(identifier.value, userToUpdate)
          : userSqlRepository.updateUserByEntityId(identifier.value, userToUpdate);

      const [mongoResult, sqlResult] = await Promise.allSettled([updateMongoPromise, updateSqlPromise]);

      if (mongoResult.status === 'rejected' || mongoResult.value == null) {
        throw WarnError.notFound(
          `Unable to update user ${user.email} in MongoDB: ${mongoResult.status === 'rejected' ? mongoResult.reason : 'User not found'}`,
        );
      }

      if (sqlResult.status === 'rejected' || sqlResult.value == null) {
        throw WarnError.notFound(
          `Unable to update user ${user.email} in SQL: ${sqlResult.status === 'rejected' ? sqlResult.reason : 'User not found'}`,
        );
      }

      const mongoUser = validateUpdate<IMongoUserModel>(mongoResult);

      const { value: dbUser } = mongoResult;

      const userAggregate = UserAggregate.fromData({
        email: dbUser.email,
        name: dbUser.name,
        addresses: dbUser.addresses,
        status: dbUser.status,
        entityId: dbUser.entityId,
        kycStatus: dbUser.kycStatus,
        emailStatus: dbUser.emailStatus,
      });

      const userAggregatedEvents = [...userAggregate.getDomainEvents()];

      for (const event of userAggregatedEvents) {
        DomainEventDispatcher.dispatch(event);
      }

      return { user: userAggregate, id: mongoUser._id };
    } catch (error) {
      logger.error(error instanceof Error ? error.message : JSON.stringify(error), {
        file: 'src/myapp/usecases/updateUser.usecase.ts',
        service: 'playground',
        code: code ?? 'no code',
      });
      throw new WarnError({
        message: 'cannot add user, check logs',
        statusCode: error instanceof BaseError ? error.statusCode : 400,
      });
    }
  };

  return updateUserUsecase;
};

const validateUpdate = <T>(result: PromiseSettledResult<T | null>): T => {
  if (result.status === 'rejected' || result.value == null) {
    throw WarnError.notFound(`Unable to update user: ${result.status === 'rejected' ? result.reason : 'User not found'}`);
  }
  return result.value;
};
