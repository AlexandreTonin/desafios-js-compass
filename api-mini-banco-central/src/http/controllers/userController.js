import { UserService } from '../../domain/services/UserService.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { logger } from '../../infra/logger/logger.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const userController = {
  async createAccount(req, res) {
    const data = req.body;
    const userId = req.params.id;

    data.userId = userId;

    try {
      const account = await userService.createAccount(data);

      res.status(201).json({
        success: true,
        message: 'Account created successfull',
        data: account,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      logger.error(error, message);

      return res.status(status).json({
        success: false,
        message,
      });
    }
  },

  async createTransaction(req, res) {
    const userId = req.params.id;
    const { fromAccountId, toAccountId, amount, description } = req.body;

    const data = {
      userId,
      fromAccountId,
      toAccountId,
      amount,
      description,
    };

    try {
      const transaction = await userService.createTransaction(data);

      res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      logger.error(error, message);

      return res.status(status).json({
        success: false,
        message,
      });
    }
  },

  async getBalance(req, res) {
    const userId = req.params.id;
    const institution = req.query.instituicao;

    const data = {
      userId,
      institution,
    };

    try {
      const balance = await userService.getBalance(data);

      res.status(200).json({
        success: true,
        data: balance,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      logger.error(error, message);

      return res.status(status).json({
        success: false,
        message,
      });
    }
  },

  async getStatement(req, res) {
    const userId = req.params.id;
    const institution = req.query.instituicao;

    const data = { userId, institution };

    try {
      const statement = await userService.getStatement(data);

      res.status(200).json({
        success: true,
        data: statement,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      logger.error(error, message);

      return res.status(status).json({
        success: false,
        message,
      });
    }
  },
};

export { userController };
