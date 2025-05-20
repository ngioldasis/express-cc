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

## What's included

- The `@express-cc/server` package provides configurable resource locking mechanism for express apps.

- The `@express-cc/react-client` package provides a React hook for resource locking

Please refer to the README file inside each package for further instructions and examples.

## License

MIT
