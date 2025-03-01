import express, { type Request, type Response, type Router, type NextFunction } from 'express';
import { WarnError } from './core/errors';
import { makeUUID } from './core/shared/helpers/uuidMaker';
import { LoggerMiddleware } from './core/shared/middleware/logger.middleware';
import { expressEssentials } from './core/shared/middleware/essentials.middleware';
import { expressRateLimiter } from './core/shared/middleware/rateLimiter.middleware';
import { credentialsMiddleware } from './core/shared/middleware/credentials.middleware';
import ExceptionMiddleware from './core/shared/middleware/exception.middleware';

interface ServerOptions {
  port: number;
  apiPrefix: string;
  platform: string;
  routes: Router;
  nodeEnv: string;
}

const loggerMiddleware = new LoggerMiddleware(makeUUID);

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly platform: string;
  private readonly routes: Router;
  private readonly apiPrefix: string;
  private readonly nodeEnv: string;

  constructor(options: ServerOptions) {
    const { port, platform, routes, apiPrefix, nodeEnv } = options;
    this.port = port;
    this.platform = platform;
    this.routes = routes;
    this.apiPrefix = apiPrefix;
    this.nodeEnv = nodeEnv;
  }

  async start(): Promise<void> {
    //* Middlewares
    expressEssentials(this.app);
    expressRateLimiter(this.app);

    this.app.use(loggerMiddleware.writeRequest);
    this.app.use(credentialsMiddleware);

    this.app.use(this.apiPrefix, this.routes);

    //* Handle not found routes in /api/v1/* (only if 'Public content folder' is not available)
    this.routes.all('*', (req: Request, _: Response, next: NextFunction): void => {
      next(WarnError.notFound(`Cant find ${req.originalUrl} on this app!`));
    });

    // Handle errors middleware
    this.app.use(ExceptionMiddleware);

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}... Platform: ${this.platform}.... Environment: ${this.nodeEnv}...`);
    });
  }
}
