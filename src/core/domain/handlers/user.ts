import { logger } from '@/shared/logger';
import { DomainAsyncEventDispatcher } from '../events/domain-async-dispacher.event';
import { DomainEventDispatcher } from '../events/domain-dispacher.event';
import { UserRegisteredEvent } from '../events/user-register.event';

DomainAsyncEventDispatcher.register(UserRegisteredEvent, async (event) => {
  const result = await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.email === 'dummy@dummy.com') {
        reject(new Error('email cannot be "dummy"'));
      } else {
        resolve(`Result for ${event.email} all good`);
      }
    }, 100),
  );

  logger.info(JSON.stringify(result), {
    file: 'src/core/domain/handlers/user.ts',
    service: 'playground',
    code: '',
  });
});

DomainAsyncEventDispatcher.register(UserRegisteredEvent, async (event) => {
  const result = await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.name === 'dummy') {
        reject(new Error('Name cannot be "dummy"'));
      } else {
        resolve(`Result for ${event.name} all good`);
      }
    }, 100),
  );

  logger.info(JSON.stringify(result), {
    file: 'src/core/domain/handlers/user.ts',
    service: 'playground',
    code: '',
  });
});

DomainEventDispatcher.register(UserRegisteredEvent, (event) => {
  dummyAsync(event)
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

const dummyAsync = async (event: UserRegisteredEvent): Promise<string> => {
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      if (event.email === 'hola@hola.com') {
        reject(new Error(`email ${event.email} is high risk, check it please`));
      } else {
        resolve(`email ${event.email} all good`);
      }
    }, 100),
  );
};
