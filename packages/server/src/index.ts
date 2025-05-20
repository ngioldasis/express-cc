import { upplyConfig } from './locking/lockConfig';
import { getRouter } from './routes/locksRoutes';
import { CCServerOptions } from './types';
import express, { NextFunction, Request, Response } from 'express';

export const getLockingRouter = (cfg: CCServerOptions) => {
  upplyConfig(cfg);
  return getRouter();
};

export const createCCserver = (cfg: CCServerOptions) => {
  upplyConfig(cfg);
  const ccApp = express();
  ccApp.use(
    '/locks',
    [
      async (req: Request, res: Response, next: NextFunction) => {
        const lockerId = req.get('x-cc-locker-id');
        if (!lockerId) {
          res.status(400).json({ success: false, code: 'UKNOWN_USER', message: 'Unknown User' });
          return;
        }
        //@ts-ignore
        req['lockerId'] = lockerId;
        next();
      },
    ],
    getRouter()
  );
  return ccApp;
};
