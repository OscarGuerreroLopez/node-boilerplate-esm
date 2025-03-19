import { logger } from '@/shared/logger';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { AddressRegisteredEvent } from '@/core/domain/user/events/address-register.event';

DomainEventDispatcher.register(AddressRegisteredEvent, (event) => {
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

const fakeCountryCheckerService = async (event: AddressRegisteredEvent): Promise<string> => {
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.country === 'country') {
        reject(new Error(`[ADDRESS HANDLER] Country ${event.country} is high risk, check it please`));
      } else {
        resolve(`[ADDRESS HANDLER] Country ${event.country} is all good`);
      }
    }, 2000),
  );
};
