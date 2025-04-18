import { UserAggregate } from '@/core/domain/user/entities/user.aggregate';
import { UserEntity } from '@/core/domain/user/entities/user.entity';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { WarnError } from '@/core/errors';
import { type AddUserUsecase, type MakeAddUser } from '@/core/types/user/usecases';
import { logger } from '@/shared/logger';
import { AddressEntity } from '@/core/domain/user/entities/address.entity';
import { userModelFactory } from '@/core/types/models/user.model.factory';
import { BaseError } from '@/core/errors/base.error';
import { type AddUserDto } from '@/core/dtos/addUser.dto';
import { type UserMongoRepository } from '@/infra/mongoRepositories/user.repository';
import { type UserSqlRepository } from '@/infra/sqlRepositories/user.repository';
import { type IMongoUserModel } from '@/core/types/models/user.model';

export const makeAddUserUsecase: MakeAddUser = (userMongoRepository, userSqlRepository) => {
  const addUserUsecase: AddUserUsecase = async ({ user, code }) => {
    try {
      const userAggregate = createUserAggregate(user);

      const userModel = await saveUserToRepositories(userAggregate, userMongoRepository, userSqlRepository);

      updateAggregateWithDatabaseResults(userAggregate, userModel);

      void dispatchDomainEvents(userAggregate);

      return { user: userAggregate, id: userModel._id };
    } catch (error) {
      logger.error(error instanceof Error ? error.message : JSON.stringify(error), {
        file: 'src/myapp/usecases/addUser.usecase.ts',
        service: 'playground',
        code: code ?? 'no code',
      });
      throw new WarnError({
        message: 'cannot add user, check logs',
        statusCode: error instanceof BaseError ? error.statusCode : 400,
      });
    }
  };

  return addUserUsecase;
};

const getReason = (result: PromiseSettledResult<any>): string => {
  if (result.status === 'rejected') {
    return typeof result.reason === 'object' && result.reason !== null
      ? typeof result.reason.message === 'string'
        ? result.reason.message
        : String(result.reason)
      : String(result.reason);
  }
  return '';
};

const createUserAggregate = (user: AddUserDto): UserAggregate => {
  const userEntity = UserEntity.create({
    name: user.name,
    email: user.email,
  });

  const addressEntities = user.addresses.map((address) =>
    AddressEntity.create({
      street: address.street,
      city: address.city,
      country: address.country,
    }),
  );

  return UserAggregate.create(userEntity, addressEntities);
};

const saveUserToRepositories = async (
  userAggregate: UserAggregate,
  userMongoRepository: UserMongoRepository,
  userSqlRepository: UserSqlRepository,
): Promise<IMongoUserModel> => {
  const userModel = userModelFactory({ ...userAggregate.toValue() });

  const [mongoResult, sqlResult] = await Promise.allSettled([userMongoRepository.addUser(userModel), userSqlRepository.addUser(userModel)]);

  return validateRepositoryResults(mongoResult, sqlResult);
};

const validateRepositoryResults = (mongoResult: PromiseSettledResult<any>, sqlResult: PromiseSettledResult<any>): IMongoUserModel => {
  if (mongoResult.status === 'rejected' || sqlResult.status === 'rejected') {
    const mongoReason = getReason(mongoResult);
    const sqlReason = getReason(sqlResult);

    const errorMessage = `
      Cannot add user:
      - MongoDB Error: ${mongoReason !== '' ? mongoReason : 'No MongoDB error'}
      - SQL Error: ${sqlReason !== '' ? sqlReason : 'No SQL error'}
    `.trim();

    throw new WarnError({
      message: errorMessage,
      statusCode: 400,
    });
  }

  if (mongoResult.status === 'fulfilled') {
    return mongoResult.value;
  }

  throw new WarnError({
    message: 'Cannot add user, MongoDB result is null. Check logs.',
    statusCode: 400,
  });
};

const updateAggregateWithDatabaseResults = (userAggregate: UserAggregate, userModel: IMongoUserModel): void => {
  const user = userAggregate.getUser();
  user.changeName(userModel.name);
  user.changeEmail(userModel.email);

  if (userModel.status != null) user.changeStatus(userModel.status);
  if (userModel.kycStatus != null) user.changeKycStatus(userModel.kycStatus);
  if (userModel.emailStatus != null) user.changeEmailStatus(userModel.emailStatus);

  userAggregate.getAddresses().forEach((address, index) => {
    address.changeStreet(userModel.addresses[index].street);
    address.changeCity(userModel.addresses[index].city);
    address.changeCountry(userModel.addresses[index].country);

    const addressStatus = userModel.addresses[index].status;

    if (addressStatus != null) {
      address.changeStatus(addressStatus);
    }
  });
};

const dispatchDomainEvents = async (userAggregate: UserAggregate): Promise<void> => {
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
