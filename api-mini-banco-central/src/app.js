import express from 'express';
import { logger } from './infra/logger/logger.js';
import pinoHttp from 'pino-http';
import { userRoutes } from './http/routes/userRoutes.js';
import { institutionRoutes } from './http/routes/institutionRoutes.js';

export const app = express();

// middlewares
app.use(express.json());
app.use(pinoHttp({ logger }));

// routes
app.use('/usuarios', userRoutes);
app.use('/instituicoes', institutionRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'API is running' });
});
