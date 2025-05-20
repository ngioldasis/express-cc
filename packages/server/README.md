# @express-cc/server

## Installation

### npm

```
  npm i @express-cc/server
```

### yarn

```
  yarn add @express-cc/server
```

## Usage Example

```js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createCCserver } from '@express-cc/server';

const app = express();
const PORT = 3000;

const ccServer = createCCserver({
  duration: 180, // 3 minutes
  maxRenewals: 2, //2 renewals
  cleanupInterval: 60, //1 minute
});
app.use('/cc', ccServer);

/* it may be also combined with middlware functions
e.g.: app.use('/cc',[fn1,fn2], ccServer);
*/

app.listen(PORT, () => {
  console.log(`Concurrency Control Server is running on http://localhost:${PORT}/cc`);
});
```

## Result

Concurrency control endpoints exposed:

- `GET localhost:3000/cc/locks/{resourceType}/{resourceId}    // acquire resource lock`
- `PATCH localhost:3000/cc/locks/{resourceType}/{resourceId}  // renew resource lock`
- `DELETE localhost:3000/cc/locks/{resourceType}/{resourceId} // release resource lock`

## Module Formats

Supports both:

- **CommonJS**: `require('@express-cc/server')`
- **ESM**: `import { useLock } from '@express-cc/server'`

## License

MIT
