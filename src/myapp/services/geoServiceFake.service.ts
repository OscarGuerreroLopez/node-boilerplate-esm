import { type IAddressModel } from '@/core/types/models/user.model';
import { type Address, Status } from '@/core/types/user';
import { type UpdateUserUsecase } from '@/core/types/user/usecases';
import { type UserRepository } from '@/infra/repositories/user.repository';
import { logger } from '@/shared/logger';

// fake service emulating an external service that gets the event

type GeoFakeService = (
  countries: Array<
    Address & {
      entityId: string;
    }
  >,
  entityId: string,
) => Promise<void>;

const logMeta = {
  file: 'src/myapp/services/geoServiceFake.service.ts',
  service: 'playground',
  code: '',
};

const fakeAsyncDelay = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log('@@@ fake await');
};

export const makeGeoServiceFake = (userRepository: UserRepository, updateUserUsecase: UpdateUserUsecase): GeoFakeService => {
  const geoFakeService: GeoFakeService = async (countries, entityId): Promise<void> => {
    try {
      await fakeAsyncDelay();

      let update = false;
      const newAddresses: IAddressModel[] = [];

      for (const { country, status, entityId, ...rest } of countries) {
        if (status === Status.VERIFIED || status === Status.BLOCKED) {
          newAddresses.push({ ...rest, country, entityId, status });
          continue; // Skip further checks
        }

        update = true;

        if (country === 'country') {
          logger.warn(`[GEO SERVICE ${entityId}] Country ${country} is high risk, check it please`, logMeta);
          newAddresses.push({ ...rest, country, entityId, status: Status.BLOCKED });
        } else {
          logger.info(`[GEO SERVICE ${entityId}] Country ${country} all good`, logMeta);
          newAddresses.push({ ...rest, country, entityId, status: Status.VERIFIED });
        }
      }

      if (update) {
        const result = await updateUserUsecase({
          user: { addresses: newAddresses },
          identifier: { type: 'entityId', value: entityId },
          code: entityId,
        });

        logger.info('succesfully updated user addresses', { ...logMeta, result });
      }
    } catch (error) {
      logger.warn(`[GEO SERVICE ${entityId}] Error in geoService`, { ...logMeta, error });
    }
  };
  return geoFakeService;
};
