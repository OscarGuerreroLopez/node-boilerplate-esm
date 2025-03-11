import { UserAggregate } from '@/core/domain/entities/user-aggregate';
import { WarnError } from '@/core/errors';
import { type GetUserUsecase, type MakeGetUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';

export const makeGetUserUsecase: MakeGetUser = (userRepository) => {
  const getUserUsecase: GetUserUsecase = async (id, code) => {
    try {
      const userModel = await userRepository.getUserById(id);

      if (userModel?.email == null || userModel?.name == null) {
        throw new WarnError({
          message: 'User data is incomplete',
          statusCode: 400,
        });
      }

      const userAggregate = UserAggregate.fromData({
        email: userModel.email,
        name: userModel.name,
        addresses: userModel.addresses,
        aggregateId: userModel.aggregateId,
      });

      console.log('@@@111', userAggregate.getUser().getEmail().value);
      console.log('@@@222', userAggregate.getAddresses()[0].getCity().value);

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
        message: 'cannot get user, check logs',
        statusCode: 400,
      });
    }
  };

  return getUserUsecase;
};
