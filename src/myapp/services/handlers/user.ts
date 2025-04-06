/* eslint-disable @typescript-eslint/no-misused-promises */
import { logger } from '@/shared/logger';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregateRegisteredEvent } from '@/core/domain/user/events/user-aggregate-register.event';
import { geoFakeService, kycFakeService, mailFakeService } from '..';

const logMeta = {
  file: 'src/core/domain/handlers/user.ts',
  service: 'playground',
  code: '',
};

DomainEventDispatcher.register(UserAggregateRegisteredEvent, async (event) => {
  try {
    const userEmail = event.user.getEmail().value;

    logger.info(`[ USER HANDLER ] new registered user event ${userEmail} `, logMeta);

    const entityId = event.id;

    await kycFakeService({ user: event.user, entityId });

    await geoFakeService({ user: event.user, addresses: event.addresses, entityId });

    await mailFakeService({ user: event.user, entityId });
  } catch (error) {
    logger.error(error instanceof Error ? error.message : JSON.stringify(error), logMeta);
  }
});

// DomainEventDispatcher.register(UserAggregateRegisteredEvent, (event) => {
//   const userEmail = event.user.getEmail().value;

//   logger.info(`[ USER HANDLER ] new registered user event ${userEmail} `, logMeta);

//   const entityId = event.id;

//   void geoFakeService({ user: event.user, addresses: event.addresses, entityId });
// });

// DomainEventDispatcher.register(UserRegisteredEvent, (event) => {
//   kycFakeService(event.name)
//     .then((result) => {
//       logger.info(result, {
//         file: 'src/core/domain/handlers/user.ts',
//         service: 'playground',
//         code: '',
//       });
//     })
//     .catch((error) => {
//       logger.warn(error instanceof Error ? error.message : JSON.stringify(error), {
//         file: 'src/core/domain/handlers/user.ts',
//         service: 'playground',
//         code: '',
//       });
//     });
// });

// DomainEventDispatcher.register(UserRegisteredEvent, (event) => {
//   mailFakeService(event.email)
//     .then((result) => {
//       logger.info(result, {
//         file: 'src/core/domain/handlers/user.ts',
//         service: 'playground',
//         code: '',
//       });
//     })
//     .catch((error) => {
//       logger.warn(error instanceof Error ? error.message : JSON.stringify(error), {
//         file: 'src/core/domain/handlers/user.ts',
//         service: 'playground',
//         code: '',
//       });
//     });
// });
