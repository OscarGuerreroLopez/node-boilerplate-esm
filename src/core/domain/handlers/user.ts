import { logger } from '@/shared/logger';
import { DomainEventDispatcher } from '../events/domain-dispacher.event';
import { UserRegisteredEvent } from '../events/user-register.event';
import { UserAggregateRegisteredEvent } from '../events/aggregate-created.event';
import { DomainAggregateEventDispatcher } from '../events/domain-aggregate-dispatcher.event';
import { UserAggregateRetrievedEvent } from '../events/aggregate-retrieved.event';

DomainAggregateEventDispatcher.register(UserAggregateRegisteredEvent, (event) => {
  logger.info(`[USER AGGREGATE HANDLER] new register user ${event.user.getEmail().value} `, {
    file: 'src/core/domain/handlers/user.ts',
    service: 'playground',
    code: '',
  });
});

DomainAggregateEventDispatcher.register(UserAggregateRetrievedEvent, (event) => {
  logger.info(JSON.stringify(event), {
    file: 'src/core/domain/handlers/user.ts',
    service: 'playground',
    code: '',
  });
});

DomainEventDispatcher.register(UserRegisteredEvent, (event) => {
  fakeKYCService(event)
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

DomainEventDispatcher.register(UserRegisteredEvent, (event) => {
  fakeEmailCheckerService(event)
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

const fakeEmailCheckerService = async (event: UserRegisteredEvent): Promise<string> => {
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.email === 'hola@hola.com') {
        reject(new Error(`[USER HANDLER] email ${event.email} is high risk, check it please`));
      } else {
        resolve(`[USER HANDLER] Result for email ${event.email} all good`);
      }
    }, 3000),
  );
};

const fakeKYCService = async (event: UserRegisteredEvent): Promise<string> => {
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.name === 'dummy') {
        reject(new Error('[USER HANDLER] Name cannot be "dummy"'));
      } else {
        resolve(`[USER HANDLER] Result for name ${event.name} all good`);
      }
    }, 5000),
  );
};
