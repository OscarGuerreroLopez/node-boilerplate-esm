import { logger } from '@/shared/logger';
import { AddAddressEvent } from '../events/add-address.event';
import { DomainEventDispatcher } from '../events/domain-dispacher.event';

DomainEventDispatcher.register(AddAddressEvent, (event) => {
  fakeCountryCheckerService(event)
    .then((result) => {
      logger.info(result, {
        file: 'src/core/domain/handlers/user.ts',
        service: 'playground',
        code: '',
      });
    })
    .catch((error) => {
      logger.warn(error instanceof Error ? error.message : JSON.stringify(error), {
        file: 'src/core/domain/handlers/user.ts',
        service: 'playground',
        code: '',
      });
    });
});

const fakeCountryCheckerService = async (event: AddAddressEvent): Promise<string> => {
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.country === 'country') {
        reject(new Error(`[ADDRESS HANDLER] Country ${event.country} is high risk, check it please`));
      } else {
        resolve(`[ADDRESS HANDLER] Country ${event.country} is all good`);
      }
    }, 200),
  );
};
