import { UserRepository } from '../repositories/UserRepository.js';
import { Account } from '../entities/Account.js';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createAccount(data) {
    if (!data || !data.institutionId || !data.userId) {
      const error = new Error(
        'Missing required fields "institutionId", "userId"',
      );
      error.status = 400;
      throw error;
    }

    const userAccounts = await this.userRepository.getAccounts(data.userId);

    const accountExists = userAccounts.filter(
      (account) => account.institution_id == data.institutionId,
    );

    if (accountExists.length > 0) {
      const error = new Error(
        'User already have an account in this institution',
      );
      error.status = 400;
      throw error;
    }

    const account = new Account(data);
    return await this.userRepository.createAccount(account);
  }

  async getBalance(userId) {
    if (!userId) {
      const error = new Error('userId is required');
      error.status = 400;
      throw error;
    }

    try {
      return await this.userRepository.getBalance(userId);
    } catch (error) {
      throw error;
    }
  }

  async getStatement() {}
}

export { UserService };
