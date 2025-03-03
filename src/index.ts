import { envs } from './core/config/env';
import { AppRoutes } from './myapp/presentation/routes';

import { Server } from './server';

const main = (): void => {
  const server = new Server({
    port: envs.PORT,
    apiPrefix: `/${envs.SERVICE_NAME}/${envs.API_PREFIX}`,
    platform: envs.PLATFORM,
    routes: AppRoutes.routes,
    nodeEnv: envs.NODE_ENV,
  });
  void server.start();
};

(() => {
  main();
})();
