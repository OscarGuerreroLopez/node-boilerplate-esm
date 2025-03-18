import { logger } from '@/shared/logger';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregateRegisteredEvent } from '@/core/domain/user/events/aggregate-created.event';
import { UserAggregateRetrievedEvent } from '@/core/domain/user/events/aggregate-retrieved.event';
// import { UserRegisteredEvent } from '@/core/domain/user/events/user-register.event';
import { kycFakeService } from '../kycFake.service';
import { mailFakeService } from '../mailFake.service';
import { geoFakeService } from '../geoServiceFake.service';

DomainEventDispatcher.register(UserAggregateRegisteredEvent, (event) => {
  logger.info(`[USER AGGREGATE HANDLER] new registered user ${event.user.getEmail().value} `, {
    file: 'src/core/domain/handlers/user.ts',
    service: 'playground',
    code: '',
  });

  const userName = event.user.getName().value;
  const userEmail = event.user.getEmail().value;
  const userAddresses = event.addresses.map((address) => address.getCountry().value);
  const aggregateId = event.id;

  void kycFakeService(userName, aggregateId);

  void mailFakeService(userEmail, aggregateId);

  void geoFakeService(userAddresses, aggregateId);
});

DomainEventDispatcher.register(UserAggregateRetrievedEvent, (event) => {
  const user = event.user.getName().value;
  const userEmail = event.user.getEmail().value;
  logger.info(`[USER AGGREGATE HANDLER] user retrieved ${user} email: ${userEmail} `, {
    file: 'src/core/domain/handlers/user.ts',
    service: 'playground',
    code: '',
  });
});

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
