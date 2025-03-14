import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { UserEntity } from '@/core/domain/user/entities/user.entity';
import { DomainAggregateEventDispatcher } from '@/core/domain/events/domain-aggregate-dispatcher.event';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { WarnError } from '@/core/errors';
import { type AddUserUsecase, type MakeAddUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';
import { AddressEntity } from '@/core/domain/user/entities/address.entity';

export const makeAddUserUsecase: MakeAddUser = (userRepository) => {
  const addUserUsecase: AddUserUsecase = async ({ user, code }) => {
    try {
      const userEntity = UserEntity.create(user);
      const addressEntities = user.addresses.map((address) =>
        AddressEntity.create({ street: address.street, city: address.city, country: address.country }),
      );

      const userAggregate = UserAggregate.create(userEntity, addressEntities);

      const userModel = await userRepository.addUser({
        email: userAggregate.getUser().getEmail().value,
        name: userAggregate.getUser().getName().value,
        aggregateId: userAggregate.aggregateId,
        addresses: userAggregate.getAddresses().map((address) => ({
          street: address.getStreet().value,
          city: address.getCity().value,
          country: address.getCountry().value,
        })),
      });

      const allEvents = [...userEntity.getDomainEvents(), ...addressEntities.flatMap((address) => address.getDomainEvents())];

      for (const event of allEvents) {
        DomainEventDispatcher.dispatch(event);
      }

      const allUserAggregatedEvent = [...userAggregate.getDomainEvents()];

      for (const event of allUserAggregatedEvent) {
        DomainAggregateEventDispatcher.dispatch(event);
      }

      userEntity.clearDomainEvents();
      addressEntities.forEach((address) => {
        address.clearDomainEvents();
      });
      userAggregate.clearDomainEvents();

      return {
        id: userModel._id, // Use ID from DB
        email: userModel.email,
        name: userModel.name,
        addresses: userModel.addresses.map(({ street, city, country }) => ({
          street,
          city,
          country,
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
