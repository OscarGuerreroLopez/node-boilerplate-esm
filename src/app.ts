/* eslint-disable @typescript-eslint/no-magic-numbers */
import express, { type Request, type Response, type NextFunction } from 'express';
import { envs } from './core/config/env';
import { AppRoutes } from './myapp/presentation/routes';
import { LoggerMiddleware } from './core/shared/middleware/logger.middleware';
import { makeUUID } from './core/shared/helpers/uuidMaker';
import { expressEssentials } from './core/shared/middleware/essentials.middleware';
import { credentialsMiddleware } from './core/shared/middleware/credentials.middleware';
import { WarnError } from './core/errors';
import ExceptionMiddleware from './core/shared/middleware/exception.middleware';
import { expressRateLimiter } from './core/shared/middleware/rateLimiter.middleware';

const apiPrefix = `/${envs.SERVICE_NAME}/${envs.API_PREFIX}`;
const routes = AppRoutes.routes;

const loggerMiddleware = new LoggerMiddleware(makeUUID);

const app = express();

expressEssentials(app);
expressRateLimiter(app);

app.use(loggerMiddleware.writeRequest);
app.use(credentialsMiddleware);

app.use(apiPrefix, routes);

routes.all('*', (req: Request, _: Response, next: NextFunction): void => {
  next(WarnError.notFound(`Cant find ${req.originalUrl} on this app!`));
});

app.use(ExceptionMiddleware);

export default app;
