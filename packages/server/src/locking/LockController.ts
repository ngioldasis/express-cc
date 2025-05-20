import { get } from 'http';
import { getConfig } from './lockConfig';

export class EditLock {
  resourceType: string;
  resourceId: string;
  ownerId: string;
  duration: number;
  acquiredAt: Date;
  expiresAt: Date;
  constructor(type: string, id: string, userId: string) {
    this.resourceType = type;
    this.resourceId = id;
    this.ownerId = userId;
    this.duration = getConfig().duration ?? 60; // default to 60 seconds if undefined
    this.acquiredAt = new Date();
    this.expiresAt = new Date(Date.now() + (getConfig().duration ?? 180) * 1000);
  }
  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
  renew(): void {
    this.expiresAt = new Date(Date.now() + (getConfig().duration ?? 180) * 1000);
  }
  toJson(): object {
    return {
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      ownerId: this.ownerId,
      duration: this.duration,
      acquiredAt: this.acquiredAt,
      expiresAt: this.expiresAt,
    };
  }
}

const grantedLocks: Map<string, EditLock> = new Map();

export const setUpLockCleanup = (): void => {
  console.log('Setting up lock cleanup interval every ', getConfig().cleanupInterval);
  const cleanUpInterval = setInterval(() => {
    grantedLocks.forEach((lock, key) => {
      console.log('Checking expiration of Lock:', key);
      if (lock.isExpired()) {
        console.log('Lock expired and removed:', key);
        grantedLocks.delete(key);
      }
    });
  }, (getConfig().cleanupInterval ?? 30) * 1000); // Check every minute
};

const shouldRenew = (lock: EditLock): boolean => {
  const now = new Date();
  //@ts-ignore
  const maxDuration = new Date(lock.acquiredAt.getTime() + getConfig().maxRenewals * getConfig().duration * 1000);
  //@ts-ignore
  return new Date(Date.now() + getConfig().duration * 1000) <= maxDuration;
};

export const acquireLock = (type: string, id: string, userId: string): Object | null => {
  const lockKey = `${type}::${id}`;
  const existingLock = grantedLocks.get(lockKey);
  if (existingLock) {
    if (existingLock.isExpired()) {
      grantedLocks.delete(lockKey);
    } else if (existingLock.ownerId === userId) {
      return existingLock.toJson(); // Return the existing lock if it's owned by the user
    } else {
      throw new Error('ALREADY_LOCKED'); // Throw an error if the max duration is exceeded
    }
  }

  const newLock = new EditLock(type, id, userId);
  grantedLocks.set(lockKey, newLock);
  //console.log('Lock ', lockKey, ' granted to user ', userId);
  return newLock.toJson(); // Return the new lock
};

export const releaseLock = (type: string, id: string, userId: string): boolean => {
  const lockKey = `${type}::${id}`;
  const existingLock = grantedLocks.get(lockKey);
  if (existingLock && existingLock.ownerId === userId) {
    grantedLocks.delete(lockKey);
    //console.log('Lock ', lockKey, ' released by user ', userId);
    return true; // Lock released successfully
  }
  return false; // Lock not found or not owned by the user
};

export const renewLock = (type: string, id: string, userId: string): Object | null => {
  const lockKey = `${type}::${id}`;
  const existingLock = grantedLocks.get(lockKey);
  if (existingLock && existingLock.ownerId === userId) {
    if (shouldRenew(existingLock)) {
      existingLock.renew();
      //console.log('renewLock', lockKey, 'renewed by user ', userId);
    } else {
      //console.log('Lock', lockKey, ' renewal will exceed max duration. Not renewed ', userId);
      grantedLocks.delete(lockKey); // Remove the lock if it exceeds max duration
      throw new Error('MAX_LOCK_DURATION_EXCEEDED'); // Throw an error if the max duration is exceeded
    }
    return existingLock.toJson(); // Return the renewed lock
  }
  throw new Error('LOCK_NOT_FOUND');
};

export const clearLocks = (): void => {
  grantedLocks.clear();
  //console.log('All locks cleared');
};
