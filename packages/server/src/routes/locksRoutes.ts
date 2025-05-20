import { Router } from 'express';
import { acquireLockHandler, releaseLockHandler, renewLockHandler, clearLocksHandler } from '../locking/lockHandlers';
import { getConfig } from '../locking/lockConfig';
import { setUpLockCleanup } from '../locking/LockController';

const router = Router();
const prefix = '';
export function getRouter(): Router {
  router.route(`${prefix}/:type/:id`).get(acquireLockHandler);
  router.route(`${prefix}/:type/:id`).delete(releaseLockHandler);
  router.route(`${prefix}/:type/:id`).patch(renewLockHandler);
  setUpLockCleanup();
  return router;
}
