import { logger } from '@/shared/logger';

export const geoFakeService = async (countries: string[], aggregateId: string): Promise<void> => {
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      for (const country of countries) {
        if (country === 'country') {
          logger.warn(`[ GEO SERVICE ${aggregateId}] country ${country}} is high risk, check it please`, {
            file: 'src/myapp/services/geoServiceFake.service.ts',
            service: 'playground',
            code: '',
          });
          reject(new Error(`[ GEO SERVICE ] Country ${country} is high risk, check it please`));
        } else {
          logger.info(`[ GEO SERVICE ${aggregateId}] country ${country}} all good`, {
            file: 'src/myapp/services/geoServiceFake.service.ts',
            service: 'playground',
            code: '',
          });
          resolve(`[ GEO SERVICE ] Country ${country} is all good`);
        }
      }
    }, 3000),
  );
};
