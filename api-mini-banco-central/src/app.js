import express from 'express';
import { logger } from './infra/logger/logger.js';
import pinoHttp from 'pino-http';
import { userRoutes } from './http/routes/userRoutes.js';
import { institutionRoutes } from './http/routes/institutionRoutes.js';
import { openFinanceRoutes } from './http/routes/openFinance.js';
import path from 'path';
import { fileURLToPath } from 'url';

export const app = express();

// middlewares
app.use(express.json());
// app.use(pinoHttp({ logger }));

// public assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

// routes
app.use('/usuarios', userRoutes);
app.use('/instituicoes', institutionRoutes);
app.use('/openfinance', openFinanceRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'API is running' });
});
