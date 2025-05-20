import express from 'express';

import { createCCserver } from '@express-cc/server';

const app = express();
const PORT = 3000;

// Middleware
const ccServer = createCCserver({
  duration: 180,
  maxRenewals: 2,
  cleanupInterval: 60,
});
app.use('/cc', ccServer);
// Start the server
app.listen(PORT, () => {
  console.log(`Example server is running on http://localhost:${PORT}`);
});
