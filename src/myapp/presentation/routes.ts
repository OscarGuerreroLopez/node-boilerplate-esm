import { Router } from 'express';
import { MyAppController } from './controller';

export const AppRoutes = {
  get routes(): Router {
    const router = Router();

    const controller = new MyAppController();

    router.get('/meta', controller.getMeta);

    return router;
  },
};
