import { Router } from 'express';
import { MyAppController } from './controller';

export const AppRoutes = {
  get routes(): Router {
    const router = Router();

    const controller = new MyAppController();

    router.get('/meta', controller.getMeta);
    router.post('/add-user', controller.addUser);

    return router;
  },
};
