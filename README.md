# express-concurency-control

A monorepo of packages for resource locking in Express and React applications.

## Packages

This workspace includes:

- **@express-cc/server**: Express middleware for resource locking APIs.
- **@express-cc/react-client**: React hook for resource locking, compatible with CommonJS and ESM.
- **example-react-app**: Sample React app demonstrating resource locking.
- **example-server**: Sample Express server implementing the locking API.

## Development

Yarn is used for dependency management and building.

```bash
# Install all dependencies
yarn install

# Build all packages
yarn build

# Start the development server
yarn dev
```

## @express-cc/react-client

The `@express-cc/react-client` package provides a React hook for resource locking, supporting both CommonJS and ESM.

### Building and Publishing

```bash
# Build the package
cd packages/react-client
yarn build

# Publish the package
yarn publish
```

### Usage Example

```jsx
import React from 'react';
import { useLock } from '@express-cc/react-client';

function ResourceEditor({ resourceId }) {
  const { lock, lockLost } = useLock('resource', resourceId, {
    baseUrl: 'https://api.example.com',
    duration: 180, // Lock duration in seconds
    retryInterval: 10, // Retry interval in seconds
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
      {/* Editor UI */}
    </div>
  );
}
```

## Module Formats

Supports both:

- **CommonJS**: `require('@express-cc/react-client')`
- **ESM**: `import { useLock } from '@express-cc/react-client'`

## License

MIT
