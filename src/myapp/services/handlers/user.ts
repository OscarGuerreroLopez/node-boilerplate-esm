import { logger } from '@/shared/logger';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregateRegisteredEvent } from '@/core/domain/user/events/user-aggregate-register.event';
import { geoFakeService, kycFakeService, mailFakeService } from '..';

const logMeta = {
  file: 'src/core/domain/handlers/user.ts',
  service: 'playground',
  code: '',
};

DomainEventDispatcher.register(UserAggregateRegisteredEvent, (event) => {
  const userEmail = event.user.getEmail().value;

  logger.info(`[ USER HANDLER ] new registered user event ${userEmail} `, logMeta);

  const entityId = event.id;

  void kycFakeService({ user: event.user, entityId });

  void geoFakeService({ user: event.user, addresses: event.addresses, entityId });

  void mailFakeService({ user: event.user, entityId });
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
