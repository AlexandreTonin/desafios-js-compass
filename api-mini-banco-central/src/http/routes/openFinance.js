import express from 'express';
import { openFinanceController } from '../controllers/OpenFinanceController.js';

const router = express.Router();

router.post('/', openFinanceController.consent);
router.patch('/:action', openFinanceController.updateAuthorization);
router.get('/', openFinanceController.getBalance);
router.post('/transaction', openFinanceController.createTransaction);

export { router as openFinanceRoutes };
