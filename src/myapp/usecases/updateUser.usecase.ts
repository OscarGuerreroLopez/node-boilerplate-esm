import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import { type MakeUpdateUser, type UpdateUserUsecase } from '@/core/types/user/usecases';
import { type IAddressModel } from '@/core/types/models/user.model';

export const makeUpdateUserUsecase: MakeUpdateUser = (userRepository): UpdateUserUsecase => {
  const updateUserUsecase: UpdateUserUsecase = async ({ user, identifier, code }) => {
    let userModel;

    const userToUpdate = {
      name: user.name,
      email: user.email,
      status: user.status,
      addresses: user.addresses?.map((address) => ({
        street: address.street,
        city: address.city,
        country: address.country,
      })) as IAddressModel[],
    };

    if (identifier.type === 'id') {
      // Fetch user by ID
      userModel = await userRepository.updateUserById(identifier.value, userToUpdate);
    } else {
      // Fetch user by Aggregate ID
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
  };

  return updateUserUsecase;
};
