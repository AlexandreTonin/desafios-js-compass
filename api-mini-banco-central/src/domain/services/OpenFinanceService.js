import { OpenFinanceRepository } from '../repositories/OpenFinanceRepository.js';

class OpenFinanceService {
  constructor() {
    this.openFinanceRepository = new OpenFinanceRepository();
  }

  async consent({ cpf, expirationDate, expiration }) {
    try {
      return await this.openFinanceRepository.consent({
        cpf,
        expiration,
        expirationDate,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAuthorization({
    cpf,
    expirationDate,
    expiration,
    authorization,
    action,
  }) {
    if (action !== 'update' && action !== 'revoke') {
      const error = new Error('Action param must be "update" or "revoke"');
      error.status = 400;
      throw error;
    }

    try {
      return await this.openFinanceRepository.updateAuthorization({
        cpf,
        expirationDate,
        expiration,
        authorization,
        action,
      });
    } catch (error) {
      throw error;
    }
  }

  async getBalance(account) {
    try {
      return this.openFinanceRepository.getBalance(account);
    } catch (error) {
      throw error;
    }
  }

  async createTransaction(account, amount) {
    try {
      return this.openFinanceRepository.createTransaction(account, amount);
    } catch (error) {
      throw error;
    }
  }
}

export { OpenFinanceService };
