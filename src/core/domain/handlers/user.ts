import { logger } from '@/shared/logger';
import { DomainEventDispatcher } from '../events/domain-dispacher.event';
import { UserRegisteredEvent } from '../events/user-register.event';

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
    }, 200),
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
    }, 200),
  );
};
