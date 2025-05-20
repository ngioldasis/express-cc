import { Request, RequestHandler, Response } from 'express';
import { acquireLock, clearLocks, releaseLock, renewLock } from './LockController';
import { getConfig } from './lockConfig';

// Function to check if a value is empty (null, undefined, empty string, empty object/array)
function isValueEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

export const acquireLockHandler: RequestHandler = async (req: Request, res: Response) => {
  const { type, id } = req.params;
  //@ts-ignore
  const userId = req.lockerId;
  if (isValueEmpty(userId)) {
    res.status(400).json({ success: false, code: 'UKNOWN_USER', message: 'Unknown User' });
    return;
  }

  if (isValueEmpty(type) || isValueEmpty(id)) {
    res.status(400).json({ success: false, code: 'INVALID_RESOURCE', message: 'Invalid resource' });
    return;
  }
  try {
    const lock = acquireLock(type, id, userId as string);
    res.status(200).json({ lock });
  } catch (err: any) {
    res.status(400).json({ success: false, code: err.message, message: 'Resource is locked by another user' });
  }
};

export const releaseLockHandler: RequestHandler = async (req: Request, res: Response) => {
  const { type, id } = req.params;
  //@ts-ignore
  const userId = req.lockerId;
  if (isValueEmpty(userId)) {
    res.status(400).json({ success: false, code: 'UKNOWN_USER', message: 'Unknown User' });
    return;
  }
  if (isValueEmpty(type) || isValueEmpty(id)) {
    res.status(400).json({ success: false, code: 'INVALID_RESOURCE', message: 'Invalid resource' });
    return;
  }
  const unlocked = releaseLock(type, id, userId as string);
  res.status(200).json({ success: unlocked });
};

export const renewLockHandler: RequestHandler = async (req: Request, res: Response) => {
  const { type, id } = req.params;
  //@ts-ignore
  const userId = req.lockerId;
  if (isValueEmpty(userId)) {
    res.status(400).json({ success: false, code: 'UKNOWN_USER', message: 'Unknown User' });
    return;
  }
  if (isValueEmpty(type) || isValueEmpty(id)) {
    res.status(400).json({ success: false, code: 'INVALID_RESOURCE', message: 'Invalid resource' });
    return;
  }
  try {
    const lock = renewLock(type, id, userId as string);
    res.status(200).json({ lock });
  } catch (err: any) {
    const errorCode = err.message;
    res.status(400).json({ success: false, code: errorCode, message: errorCode === 'LOCK_NOT_FOUND' ? 'No lock has been granted to this User' : 'Max LockDuration reached' });
  }
};

export const clearLocksHandler: RequestHandler = async (req: Request, res: Response) => {
  clearLocks();
  res.status(200).json({ success: true });
};
