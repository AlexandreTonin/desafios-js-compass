import { app } from './app.js';
import { env } from './shared/config/env.js';
import { logger } from './infra/logger/logger.js';

const serverPort = env.SERVER_PORT;

app.listen(serverPort, () => {
  logger.info(`Server is running at ${serverPort} port`);
});
