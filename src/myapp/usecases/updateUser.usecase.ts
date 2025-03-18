import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { WarnError } from '@/core/errors';
import type { MakeUpdateUser, UpdateUserUsecase } from '@/core/types/user/usecases';

export const makeUpdateUserUsecase: MakeUpdateUser = (userRepository): UpdateUserUsecase => {
  const updateUserUsecase: UpdateUserUsecase = async ({ user, identifier, code }) => {
    let userModel;

    if (identifier.type === 'id') {
      // Fetch user by ID
      userModel = await userRepository.updateUserById(identifier.value, user);
    } else {
      // Fetch user by Aggregate ID
      userModel = await userRepository.updateUserByAggregateId(identifier.value, user);
    }

    if (userModel == null) {
      throw WarnError.notFound('User');
    }

    const userAggregate = UserAggregate.fromData({
      email: userModel.email,
      name: userModel.name,
      addresses: userModel.addresses,
      status: userModel.status,
      aggregateId: userModel.aggregateId,
    });

    const userAggregatedEvents = [...userAggregate.getDomainEvents()];

    for (const event of userAggregatedEvents) {
      DomainEventDispatcher.dispatch(event);
    }

    return { user: userAggregate, id: userModel._id };
  };

  return updateUserUsecase;
};
