import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { UserEntity } from '@/core/domain/user/entities/user.entity';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { WarnError } from '@/core/errors';
import { type AddUserUsecase, type MakeAddUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';
import { AddressEntity } from '@/core/domain/user/entities/address.entity';
import { type IMongoUserModel, type ISqlUserModel } from '@/core/types/models/user.model';

export const makeAddUserUsecase: MakeAddUser = (userMongoRepository, userSqlRepository) => {
  const addUserUsecase: AddUserUsecase = async ({ user, code }) => {
    try {
      const userEntity = UserEntity.create(user);
      const addressEntities = user.addresses.map((address) =>
        AddressEntity.create({ street: address.street, city: address.city, country: address.country }),
      );

      const userAggregate = UserAggregate.create(userEntity, addressEntities);

      const userModel: IMongoUserModel | ISqlUserModel = {
        email: userAggregate.getUser().getEmail().value,
        name: userAggregate.getUser().getName().value,
        entityId: userAggregate.entityId,
        addresses: userAggregate.getAddresses().map((address) => ({
          street: address.getStreet().value,
          city: address.getCity().value,
          country: address.getCountry().value,
          entityId: address.entityId,
        })),
      };

      const [mongoResult, sqlResult] = await Promise.allSettled([
        userMongoRepository.addUser(userModel),
        userSqlRepository.addUser(userModel),
      ]);

      // Handle results
      const userMongoModel = mongoResult.status === 'fulfilled' ? mongoResult.value : null;
      const userSqlModel = sqlResult.status === 'fulfilled' ? sqlResult.value : null;

      if (userMongoModel == null || userSqlModel == null) {
        throw new WarnError({
          message: 'cannot add user, check logs',
          statusCode: 400,
        });
      }

      userAggregate.getUser().changeName(userModel.name);
      userAggregate.getUser().changeEmail(userModel.email);
      if (userModel.status != null) {
        userAggregate.getUser().changeStatus(userModel.status);
      }

      if (userModel.kycStatus != null) {
        userAggregate.getUser().changeKycStatus(userModel.kycStatus);
      }

      if (userModel.emailStatus != null) {
        userAggregate.getUser().changeEmailStatus(userModel.emailStatus);
      }

      userAggregate.getAddresses().forEach((address, index) => {
        address.changeStreet(userModel.addresses[index].street);
        address.changeCity(userModel.addresses[index].city);
        address.changeCountry(userModel.addresses[index].country);

        const addressStatus = userModel.addresses[index].status;

        if (addressStatus != null) {
          address.changeStatus(addressStatus);
        }
      });

      const allUserAggregatedEvent = [...userAggregate.getDomainEvents()];

      for (const event of allUserAggregatedEvent) {
        DomainEventDispatcher.dispatch(event);
      }

      userEntity.clearDomainEvents();
      addressEntities.forEach((address) => {
        address.clearDomainEvents();
      });
      userAggregate.clearDomainEvents();

      return { user: userAggregate, id: userMongoModel._id };
    } catch (error) {
      logger.error(error instanceof Error ? error.message : JSON.stringify(error), {
        file: 'src/myapp/usecases/addUser.usecase.ts',
        service: 'playground',
        code: code ?? 'no code',
      });
      throw new WarnError({
        message: 'cannot add user, check logs',
        statusCode: 400,
      });
    }
  };

  return addUserUsecase;
};
