# @express-cc/react-client

A React hook for resource locking functionality that works in both CommonJS and ECMAScript projects.

## Installation

```bash
# With Yarn (recommended)
yarn add @express-cc/react-client

# With npm
npm install @express-cc/react-client

# With pnpm
pnpm add @express-cc/react-client
```

## Usage

```jsx
import React from 'react';
import { useLock } from '@express-cc/react-client';

function ResourceEditor({ resourceId }) {
  const { lock, lockLost } = useLock('resource', resourceId, {
    baseUrl: 'https://api.example.com/cc',
    duration: 180, // Lock duration in seconds
    retryInterval: 10, // Retry interval in seconds if lock acquisition fails
  });

  if (lockLost) {
    return <div>You have lost the lock on this resource. Please refresh to try again.</div>;
  }

  if (!lock) {
    return <div>Acquiring lock...</div>;
  }

  return (
    <div>
      <h2>Editing Resource {resourceId}</h2>
      <div>Lock expires at: {new Date(lock.expiresAt).toLocaleTimeString()}</div>
      {/* Your editor here */}
    </div>
  );
}

export default ResourceEditor;
```

## API

### useLock

```typescript
useLock(resourceType: string, resourceId: string, options: ClientOptions): { lock: Lock | null, lockLost: boolean }
```

#### Parameters

- `resourceType`: The type of resource being locked
- `resourceId`: The unique identifier for the resource
- `options`: Configuration options for the locking mechanism

#### Options (ClientOptions)

```typescript
{
  baseUrl: string;        // The base URL for the locks API
  duration: number;       // The duration of a lock in seconds
  retryInterval?: number; // The interval between retry attempts in seconds
}
```

#### Return Value

An object containing:

## Lock Object

The Lock object represents an acquired resource lock in the system.

### Properties

- `lock`: The lock object when successfully acquired, or null when no lock is held
  - Type: `Lock | null`
  - Description: If a lock was successfully acquired, this contains the lock object with details about the lock. If no lock is held (acquisition failed or lock was released), this will be null.

### Lock Type

The `Lock` type contains the following properties:

- `resourceType`: The type of the resource being locked. e.g. person, task, etc.
- `resourceId`: Id of the resource being locked
- `ownerId`: Identifier of the session/user that owns the lock
- `duration`: The duration of the lock in seconds.
- `acquiredAt`: Timestamp when the lock was acquired
- `expiresAt`: Timestamp when the lock will automatically expire

## License

MIT
