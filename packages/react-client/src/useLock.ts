import { useState, useEffect } from 'react';
import { ClientOptions, Lock } from './types';
import { LockDao } from './LockDao';

// Function to check if a value is empty (null, undefined, empty string, empty object/array)
function isValueEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

export const useLock = (resourceType: string, resourceId: string, options: ClientOptions) => {
  const [lock, setLock] = useState<Lock | null>(null);
  const [lockLost, setLockLost] = useState(false);

  useEffect(() => {
    if (options) {
      LockDao.setOptions(options);
    }
  }, [options]);

  useEffect(() => {
    return () => {
      console.log('Releasing lock on unmount');
      LockDao.releaseLock(resourceType, resourceId)
        .then(() => console.log('Lock released'))
        .catch((err) => console.error('Error releasing lock:', err));
      setLock(null);
    };
  }, [resourceType, resourceId]);

  useEffect(() => {
    let acquireTimeout: any = null;
    const lockResource = async () => {
      try {
        const { lock } = await LockDao.acquireLock(resourceType, resourceId);
        setLock(lock);
        setLockLost(false);
      } catch (err) {
        console.error(`Failed to acquire lock. Retrying in ${options.retryInterval} seconds...`);
        acquireTimeout = setTimeout(lockResource, 1000 * (options.retryInterval ?? 10)); // Retry every 10 seconds
      }
    };

    if (!lockLost && !isValueEmpty(resourceType) && !isValueEmpty(resourceId)) {
      lockResource();
    }
  }, [resourceType, resourceId, lockLost]);

  useEffect(() => {
    let rt: any = null;
    if (lock) {
      const delay = lock.duration * 1000 - 2000; // 2  seconds before the lock expires
      console.log('Lock renewal fires in', delay, 'milliseconds');
      rt = setTimeout(async () => {
        try {
          const { lock: renewedLock } = await LockDao.renewLock(lock.resourceType, lock.resourceId);
          setLock(renewedLock);
          setLockLost(false);
          console.log('Lock renewed:', renewedLock);
        } catch (err) {
          setLock(null);
          setLockLost(true);
          console.error('Lock lost');
        }
      }, Math.max(delay, 0));
      return () => clearTimeout(rt);
    }
  }, [lock]);

  return { lock, lockLost };
};
