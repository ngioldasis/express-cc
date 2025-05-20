/**
 * Represents a lock object.
 *
 * @property type - The type of the locked resource.
 * @property id - The unique identifier for the locked resource.
 * @property userId - The identifier of the user who owns the lock.
 * @property duration - The duration of the lock in seconds.
 * @property expiresAt - The timestamp indicating when the lock will expire.
 * @property createdAt - The timestamp indicating when the lock was created.
 */
export type Lock = {
  resourceType: string;
  resourceId: string;
  ownerId: string;
  duration: number;
  acquiredAt: string;
  expiresAt: string;
};

/**
 * Configuration options for the client.
 *
 * @property locksBaseUrl - The base URL for the locks API.
 * @property duration - The duration of a lock, in seconds.
 * @property retryInterval - (Optional) The interval, in secconds, between retry attempts.
 * @property apiHeaders - (Optional) Additional headers to include in API requests.
 * @apiHeaders - (Optional) Additional headers to include in API requests.
 */
export type ClientOptions = {
  baseUrl: string;
  duration: number;
  retryInterval?: number;
  apiHeaders?: Record<string, string>;
};
