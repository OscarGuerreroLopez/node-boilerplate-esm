import { Status } from '@/core/types/user';
import { type IMongoUserModel, type ISqlUserModel, type IMongoAddressModel, type ISqlAddressModel } from '@/core/types/models/user.model';

// Type Guards
const isSqlModel = (params: Partial<IMongoUserModel> | Partial<ISqlUserModel>): params is Partial<ISqlUserModel> => {
  return 'id' in params && params.id !== undefined;
};

const isMongoModel = (params: Partial<IMongoUserModel> | Partial<ISqlUserModel>): params is Partial<IMongoUserModel> => {
  return '_id' in params && params._id !== undefined;
};

// Address factory
const addressModelFactory = (
  addresses: Array<Partial<IMongoAddressModel>> | Array<Partial<ISqlAddressModel>> = [],
): IMongoAddressModel[] | ISqlAddressModel[] => {
  return addresses.map(({ street, city, country, status }) => ({
    street: street ?? '',
    city: city ?? '',
    country: country ?? '',
    status: status ?? Status.PENDING,
  }));
};

export const userModelFactory = (params: Partial<IMongoUserModel> | Partial<ISqlUserModel>): IMongoUserModel | ISqlUserModel => {
  const baseUser = {
    email: params.email ?? '',
    name: params.name ?? '',
    entityId: params.entityId ?? undefined,
    addresses: addressModelFactory(params.addresses),
    status: params.status ?? Status.PENDING,
    kycStatus: params.kycStatus ?? Status.PENDING,
    emailStatus: params.emailStatus ?? Status.PENDING,
  };

  if (isSqlModel(params)) {
    return {
      ...baseUser,
      id: params.id, // SQL-specific
    } satisfies ISqlUserModel;
  }

  if (isMongoModel(params)) {
    return {
      ...baseUser,
      _id: params._id, // MongoDB-specific
    } satisfies IMongoUserModel;
  }

  // If neither _id nor id exists, explicitly return a partial MongoDB model
  return baseUser satisfies IMongoUserModel;
};
