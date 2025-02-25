import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import requestIp from 'request-ip';

export const expressEssentials = (app: express.Express): void => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '300kb' }));
  app.use(cors({ credentials: true, origin: true }));
  app.use(helmet());
  app.use(requestIp.mw());
};
