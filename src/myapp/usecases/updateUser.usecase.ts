import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { type MakeUpdateUser, type UpdateUserUsecase } from '@/core/types/user/usecases';
import { type IMongoUserModel, type ISqlUserModel } from '@/core/types/models/user.model';
import { Status } from '@/core/types/user';
import { logger } from '@/shared/logger';
import { userModelFactory } from '@/core/types/models/user.model.factory';
import { BaseError } from '@/core/errors/base.error';
import { type UpdateUserDto } from '@/core/dtos/updateUser.dto';
import { type Identifier } from '@/core/types/common';
import { type UserMongoRepository } from '@/infra/mongoRepositories/user.repository';
import { type UserSqlRepository } from '@/infra/sqlRepositories/user.repository';

export const makeUpdateUserUsecase: MakeUpdateUser = (userMongoRepository, userSqlRepository): UpdateUserUsecase => {
  const updateUserUsecase: UpdateUserUsecase = async ({ user, identifier, code }) => {
    try {
      const userToUpdate = prepareUserData(user, identifier);
      const [mongoResult] = await updateRepositories(userToUpdate, identifier, userMongoRepository, userSqlRepository);

      const mongoUser = validateUpdate<IMongoUserModel>(mongoResult);

      const userAggregate = UserAggregate.fromData({
        email: mongoUser.email,
        name: mongoUser.name,
        addresses: mongoUser.addresses,
        status: mongoUser.status,
        entityId: mongoUser.entityId,
        kycStatus: mongoUser.kycStatus,
        emailStatus: mongoUser.emailStatus,
      });

      dispatchDomainEvents(userAggregate);

      return { user: userAggregate, id: mongoUser._id };
    } catch (error) {
      logger.error(error instanceof Error ? error.message : JSON.stringify(error), {
        file: 'src/myapp/usecases/updateUser.usecase.ts',
        service: 'playground',
        code: code ?? 'no code',
      });
      throw new WarnError({
        message: 'cannot update user, check logs',
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

// helper functions

const prepareUserData = (user: Partial<UpdateUserDto>, identifier: any): IMongoUserModel | ISqlUserModel => {
  let userStatus = user.status;
  let kycStatus = user.kycStatus;
  let emailStatus = user.emailStatus;

  if (user.name != null) userStatus = kycStatus = Status.PENDING;
  if (user.email != null) userStatus = emailStatus = Status.PENDING;

  const addresses =
    user.addresses?.map(({ street, city, country, entityId }) => {
      if (street == null || city == null || country == null) {
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

  return userModelFactory({
    name: user.name,
    email: user.email,
    status: userStatus,
    kycStatus,
    emailStatus,
    entityId: identifier.type === 'entityId' ? identifier.value : undefined,
    ...(addresses.length > 0 && { addresses }),
  });
};

const updateRepositories = async (
  userToUpdate: IMongoUserModel | ISqlUserModel,
  identifier: Identifier,
  userMongoRepository: UserMongoRepository,
  userSqlRepository: UserSqlRepository,
): Promise<[PromiseSettledResult<any>, PromiseSettledResult<any>]> => {
  const updateMongoPromise =
    identifier.type === 'id'
      ? userMongoRepository.updateUserById(identifier.value, userToUpdate)
      : userMongoRepository.updateUserByEntityId(identifier.value, userToUpdate);

  const updateSqlPromise =
    identifier.type === 'id'
      ? userSqlRepository.updateUserById(identifier.value, userToUpdate)
      : userSqlRepository.updateUserByEntityId(identifier.value, userToUpdate);

  return await Promise.allSettled([updateMongoPromise, updateSqlPromise]);
};

const dispatchDomainEvents = (userAggregate: UserAggregate): void => {
  const userEntity = userAggregate.getUser();
  const addressEntities = userAggregate.getAddresses();
  const allUserAggregatedEvent = [...userAggregate.getDomainEvents()];

  for (const event of allUserAggregatedEvent) {
    DomainEventDispatcher.dispatch(event);
  }

  userEntity.clearDomainEvents();
  addressEntities.forEach((address) => {
    address.clearDomainEvents();
  });
  userAggregate.clearDomainEvents();
};
