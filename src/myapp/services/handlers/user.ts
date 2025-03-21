import { logger } from '@/shared/logger';
import { DomainEventDispatcher } from '@/core/domain/events/domain-dispacher.event';
import { UserAggregateRegisteredEvent } from '@/core/domain/user/events/user-aggregate-register.event';
import { UserAggregateRetrievedEvent } from '@/core/domain/user/events/aggregate-retrieved.event';
// import { UserRegisteredEvent } from '@/core/domain/user/events/user-register.event';
import { kycFakeService } from '../kycFake.service';
import { mailFakeService } from '../mailFake.service';
import { geoFakeService } from '..';

const logMeta = {
  file: 'src/core/domain/handlers/user.ts',
  service: 'playground',
  code: '',
};

DomainEventDispatcher.register(UserAggregateRegisteredEvent, (event) => {
  const userName = event.user.getName().value;
  const userEmail = event.user.getEmail().value;
  const kycStatus = event.user.getKycStatus().value;
  const mailStatus = event.user.getEmailStatus().value;

  logger.info(`[ USER HANDLER ] new registered user event ${userEmail} `, logMeta);

  const userAddresses = event.addresses.map((address) => {
    return {
      country: address.getCountry().value,
      entityId: address.entityId,
      status: address.getStatus().value,
      city: address.getCity().value,
      street: address.getStreet().value,
    };
  });
  const entityId = event.id;

  void kycFakeService(userName, kycStatus, entityId);

  void mailFakeService(userEmail, mailStatus, entityId);

  void geoFakeService(userAddresses, entityId);
});

DomainEventDispatcher.register(UserAggregateRetrievedEvent, (event) => {
  const userName = event.user.getName().value;
  const userEmail = event.user.getEmail().value;
  const kycStatus = event.user.getKycStatus().value;
  const mailStatus = event.user.getEmailStatus().value;

  logger.info(`[ USER HANDLER ] user retrieved ${userName} email: ${userEmail} `, logMeta);

  const userAddresses = event.addresses.map((address) => {
    return {
      country: address.getCountry().value,
      entityId: address.entityId,
      status: address.getStatus().value,
      city: address.getCity().value,
      street: address.getStreet().value,
    };
  });
  const entityId = event.id;

  void kycFakeService(userName, kycStatus, entityId);

  void mailFakeService(userEmail, mailStatus, entityId);

  void geoFakeService(userAddresses, entityId);
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
