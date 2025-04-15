import express from 'express';
import { institutionController } from '../controllers/institutionController.js';

const router = express.Router();

router.post('/', institutionController.create);
router.get('/', institutionController.findAll);
router.get('/:id', institutionController.findOne);

export { router as institutionRoutes };
