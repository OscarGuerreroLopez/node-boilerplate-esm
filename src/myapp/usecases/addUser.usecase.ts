import { AddressEntity } from '@/core/domain/entities/address.entity';
import { UserEntity } from '@/core/domain/entities/user.entity';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { WarnError } from '@/core/errors';
import { type AddUserUsecase, type MakeAddUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';

export const makeAddUserUsecase: MakeAddUser = (userRepository) => {
  const addUserUsecase: AddUserUsecase = async ({ user, code }) => {
    try {
      const userEntity = UserEntity.create(user);

      for (const address of user.addresses) {
        const addressEntity = AddressEntity.create(address.street, address.city, address.country, userEntity.aggregateId);
        userEntity.addAddress(addressEntity);
      }

      const userModel = await userRepository.addUser({
        email: userEntity.getEmail().value,
        name: userEntity.getName().value,
        addresses: userEntity.getAddresses().map((address) => ({
          street: address.getStreet().value,
          city: address.getCity().value,
          country: address.getCountry().value,
        })),
      });

      const savedUserEntity = UserEntity.create({
        id: userModel._id,
        email: userModel.email,
        name: userModel.name,
      });

      const addressEvents = userModel.addresses.flatMap(({ street, city, country }) => {
        const addressEntity = AddressEntity.create(street, city, country, savedUserEntity.aggregateId);
        savedUserEntity.addAddress(addressEntity);
        return addressEntity.getDomainEvents();
      });

      const userEvents = savedUserEntity.getDomainEvents();

      const allEvents = [...userEvents, ...addressEvents];

      for (const event of allEvents) {
        DomainEventDispatcher.dispatch(event);
      }

      savedUserEntity.clearDomainEvents();
      userEntity.clearDomainEvents();

      return {
        id: savedUserEntity.getId().value,
        email: savedUserEntity.getEmail().value,
        name: savedUserEntity.getName().value,
        addresses: savedUserEntity.getAddresses().map((address) => ({
          street: address.getStreet().value,
          city: address.getCity().value,
          country: address.getCountry().value,
        })),
      };
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
