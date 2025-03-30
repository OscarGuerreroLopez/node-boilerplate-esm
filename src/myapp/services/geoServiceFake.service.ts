import { type AddressEntity } from '@/core/domain/user/entities/address.entity';
import { type UserEntity } from '@/core/domain/user/entities/user.entity';
import { type IMongoAddressModel } from '@/core/types/models/user.model';
import { Status } from '@/core/types/user';
import { type UserMongoRepository } from '@/infra/mongoRepositories/user.repository';
import { logger } from '@/shared/logger';

// fake service emulating an external service that gets the event

type GeoFakeService = (params: { user: UserEntity; addresses: AddressEntity[]; entityId: string }) => Promise<void>;

const logMeta = {
  file: 'src/myapp/services/geoServiceFake.service.ts',
  service: 'playground',
  code: '',
};

const fakeAsyncDelay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  console.log('@@@ fake await');
};

const forbiddenCountries = ['somalia', 'burundi'];

export const makeGeoServiceFake = (userMongoRepository: UserMongoRepository): GeoFakeService => {
  const geoFakeService: GeoFakeService = async ({ entityId, user, addresses }): Promise<void> => {
    try {
      await fakeAsyncDelay();

      let update = false;
      const newAddresses: IMongoAddressModel[] = [];

      for (const address of addresses) {
        const status = address.getStatus().value;
        const country = address.getCountry().value;
        const city = address.getCity().value;
        const street = address.getStreet().value;

        if (status === Status.VERIFIED || status === Status.BLOCKED) {
          newAddresses.push({ country, entityId: address.entityId, city, street, status });
          continue;
        }

        update = true;

        if (forbiddenCountries.includes(country.toLowerCase())) {
          logger.warn(`[GEO SERVICE ${entityId}] Country ${country} is high risk, check it please`, logMeta);
          newAddresses.push({ country, entityId: address.entityId, city, street, status: Status.BLOCKED });
        } else {
          logger.info(`[GEO SERVICE ${entityId}] Country ${country} all good`, logMeta);
          newAddresses.push({ country, entityId: address.entityId, city, street, status: Status.VERIFIED });
        }
      }

      if (update) {
        await userMongoRepository.updateUserByEntityId(entityId, {
          addresses: newAddresses,
        });

        logger.info(`[GEO SERVICE ${entityId}] succesfully updated user addresses`, { ...logMeta });
      }
    } catch (error) {
      logger.warn(`[GEO SERVICE ${entityId}] Error in geoService ${JSON.stringify(error)}`, { ...logMeta });
    }
  };
  return geoFakeService;
};
