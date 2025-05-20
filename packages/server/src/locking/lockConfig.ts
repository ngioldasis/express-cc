import { NextFunction, Request, Response } from 'express';
import { CCServerOptions } from '../types';

/**
 * Retrieves a nested property from an object using a dot-notation path or an array of path segments.
 *
 * @template T - The expected type of the retrieved property (defaults to any)
 * @param {any} obj - The object to retrieve the property from
 * @param {string | Array<string | number>} path - The path to the property, either as a dot-notation string (e.g., 'a.b.c') or an array of keys/indices
 * @returns {T | undefined} The value at the specified path, or undefined if the path doesn't exist or the input is not an object
 *
 * @example
 * // Using string path
 * const user = { profile: { name: 'John', address: { city: 'New York' } } };
 * const city = getObjectProp(user, 'profile.address.city'); // Returns 'New York'
 *
 * @example
 * // Using array path
 * const user = { profile: { name: 'John', address: { city: 'New York' } } };
 * const city = getObjectProp(user, ['profile', 'address', 'city']); // Returns 'New York'
 */
function getObjectProp<T = any>(obj: any, path: string | Array<string | number>): T | undefined {
  if (!obj || typeof obj !== 'object') return undefined;

  const keys = Array.isArray(path) ? path : path.split('.').filter(Boolean); // removes empty strings

  return keys.reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key as keyof typeof acc];
    }
    return undefined;
  }, obj);
}

const config: CCServerOptions = {
  duration: 3 * 60, // 3 minutes
  maxRenewals: 3, // 3 times
  cleanupInterval: 1 * 60, // 1 minute
};

export const upplyConfig = (cfg: CCServerOptions) => {
  if (cfg && typeof cfg === 'object' && !Array.isArray(cfg)) {
    Object.keys(cfg).forEach((key) => {
      if (key in config) {
        // @ts-ignore
        config[key] = cfg[key];
      }
    });
  }
};

export const getConfig = (): CCServerOptions => {
  return { ...config };
};
