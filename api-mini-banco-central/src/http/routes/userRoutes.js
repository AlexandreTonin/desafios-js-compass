import express from 'express';
import { userController } from '../controllers/userController.js';

const router = express.Router();

router.post('/', userController.createUser);
router.post('/:id/contas', userController.createAccount);
router.post('/:id/transacoes', userController.createTransaction);
router.get('/:id/saldo', userController.getBalance);
router.get('/:id/extrato', userController.getStatement);

export { router as userRoutes };
