import axios from 'axios';

import { ClientOptions, Lock } from './types';

function getUUID(): string {
  const key = 'xcc-device-id';
  let uuid = localStorage.getItem(key);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(key, uuid);
  }
  return uuid;
}
const deviceId = getUUID();

let options: ClientOptions = {
  baseUrl: '',
  duration: 180,
  retryInterval: 10,
  apiHeaders: { 'Content-Type': 'application/json', 'x-cc-locker-id': deviceId },
};

let apiClient = axios.create({
  timeout: 10000,
  headers: options.apiHeaders,
});

export const setApiClient = (client: any) => {
  apiClient = client;
};

export const LockDao = {
  setOptions: (opts: ClientOptions) => {
    options = { ...options, ...opts, apiHeaders: { ...options.apiHeaders, ...opts.apiHeaders } };
  },
  acquireLock: async (resourceType: string, resourceId: any): Promise<{ lock: Lock }> => {
    try {
      const { data } = await apiClient.get(`${options.baseUrl}/locks/${resourceType}/${resourceId}`, { headers: options.apiHeaders });
      return data;
    } catch (error) {
      throw error;
    }
  },
  renewLock: async (resourceType: string, resourceId: any): Promise<{ lock: Lock }> => {
    try {
      const { data } = await apiClient.patch(`${options.baseUrl}/locks/${resourceType}/${resourceId}`, { headers: options.apiHeaders });
      return data;
    } catch (error) {
      throw error;
    }
  },
  releaseLock: async (resourceType: string, resourceId: any): Promise<boolean> => {
    try {
      await apiClient.delete(`${options.baseUrl}/locks/${resourceType}/${resourceId}`, { headers: options.apiHeaders });
      return true;
    } catch (error) {
      return true;
    }
  },
};
