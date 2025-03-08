import { logger } from '@/shared/logger';
import { AddAddressEvent } from '../events/add-address.event';
import { DomainAsyncEventDispatcher } from '../events/domain-async-dispacher.event';

DomainAsyncEventDispatcher.register(AddAddressEvent, async (event) => {
  const result = await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.city === 'city') {
        reject(new Error('city cannot be "city"'));
      } else {
        resolve(`Result for ${event.city} all good`);
      }
    }, 100),
  );

  logger.info(JSON.stringify(result), {
    file: 'src/core/domain/handlers/address.ts',
    service: 'playground',
    code: '',
  });
});
