import pkg from 'pg';
import { logger } from '../../infra/logger/logger.js';
import { env } from './env.js';
const { Pool } = pkg;

// Create a connection pool with optimized settings for the application
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection before timing out
});

// Log when a new connection is established
pool.on('connect', () => {
  logger.info('Database connected');
});

// Handle unexpected errors on idle clients to prevent application crashes
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1); // Exit the process to prevent further errors
});

export { pool as database };
