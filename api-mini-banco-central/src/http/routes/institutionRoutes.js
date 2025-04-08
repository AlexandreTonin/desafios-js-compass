import express from 'express';
import { institutionController } from '../controllers/institutionController.js';

const router = express.Router();

router.post('/', institutionController.create);

export { router as institutionRoutes };
