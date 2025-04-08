import express from 'express';
import { logger } from './infra/logger/logger.js';
import pinoHttp from 'pino-http';

export const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'API is running' });
});
