import { OpenFinanceRepository } from '../../domain/repositories/OpenFinanceRepository.js';
import { OpenFinanceService } from '../../domain/services/OpenFinanceService.js';
import { logger } from '../../infra/logger/logger.js';
import { env } from '../../shared/config/env.js';

const openFinanceRepository = new OpenFinanceRepository();
const openFinanceService = new OpenFinanceService(openFinanceRepository);

const openFinanceController = {
  async consent(req, res) {
    const { cpf, expirationDate, expiration, authorization } = req.body;
    if (!req.body || !cpf || !authorization) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    try {
      const data = await openFinanceService.consent({
        cpf,
        expirationDate,
        expiration,
        authorization,
      });

      return res.status(200).json({
        success: true,
        message: 'Compartilhamento feito com sucesso',
        data: {
          account: {
            institutionName: data.name,
            account: data.account,
            agency: data.agency,
            image: env.HOST + '/logo_itau.jpg',
          },
        },
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

  async updateAuthorization(req, res) {
    const { cpf, expirationDate, expiration, authorization } = req.body;
    const { action } = req.params;

    if (!action || !cpf) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    try {
      const update = await openFinanceService.updateAuthorization({
        cpf,
        expirationDate,
        expiration,
        authorization,
        action,
      });

      return res.status(200).json({
        success: true,
        message:
          action == 'update'
            ? 'Autorização atualizada com sucesso'
            : 'Autorização revogada com sucesso',
        data: {
          account: {
            institutionName: 'Itaú',
            account: update.account,
            agency: update.agency,
          },
        },
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
    const { account } = req.query;

    if (!account) {
      res.status(400).json({
        success: false,
        message: 'missing required url query field "account"',
      });
    }

    try {
      const balance = await openFinanceService.getBalance(account);

      return res.status(200).json({ success: true, data: { balance } });
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
    const { account, agency, amount } = req.body;

    if (!account || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields "accounts", "amount"',
      });
    }

    try {
      const transaction = await openFinanceService.createTransaction(
        account,
        amount,
      );

      return res.status(200).json({
        success: true,
        message: 'Transação feita com sucesso',
        data: {
          balance: transaction.balance,
        },
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

export { openFinanceController };
