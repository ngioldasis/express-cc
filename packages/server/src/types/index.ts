import { NextFunction, Response } from 'express';
import { Request } from 'express';

/**
 * Configuration options for React Concurrency Control (ReactCC).
 */
export type CCServerOptions = {
  /**
   * The duration (in seconds) for which a lock is held before it expires.
   * If not specified, a default duration will be used.
   */
  duration?: number;

  /**
   * The maximum number of times a lock can be renewed.
   * If not specified, there will be no limit on lock renewals.
   */
  maxRenewals?: number;

  /**
   * The interval (in seconds) at which expired locks are cleaned up.
   * If not specified, a default cleanup interval will be used.
   */
  cleanupInterval?: number;
};
