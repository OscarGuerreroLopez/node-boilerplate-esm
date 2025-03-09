import { AddressEntity } from '@/core/domain/entities/address.entity';
import { UserEntity } from '@/core/domain/entities/user.entity';
import { DomainAsyncEventDispatcher } from '@/core/domain/events/domain-async-dispacher.event';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { WarnError } from '@/core/errors';
import { type AddUserUsecase, type MakeAddUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';

export const makeAddUserUsecase: MakeAddUser = () => {
  const addUserUsecase: AddUserUsecase = async ({ user, code }) => {
    try {
      const userEntity = UserEntity.create(user);
      const userEvents = userEntity.getDomainEvents();

      const addressEvents = [];

      for (const address of user.addresses) {
        const addressEntity = AddressEntity.create(address.street, address.city, address.country);
        userEntity.addAddress(addressEntity);
        addressEvents.push(addressEntity.getDomainEvents());
      }

      for (const event of userEvents) {
        await DomainAsyncEventDispatcher.dispatch(event);
        DomainEventDispatcher.dispatch(event);
      }

      for (const events of addressEvents) {
        for (const event of events) {
          await DomainAsyncEventDispatcher.dispatch(event);
        }
      }

      const result = {
        id: userEntity.getId().value,
        email: userEntity.getEmail().value,
        name: userEntity.getName().value,
        addresses: userEntity.getAddresses().map((address) => ({
          street: address.getStreet().value,
          city: address.getCity().value,
          country: address.getCountry().value,
        })),
      };

      userEntity.clearDomainEvents();

      return result;
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
