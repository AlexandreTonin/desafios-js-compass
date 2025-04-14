import { UserRepository } from '../repositories/UserRepository.js';
import { Account } from '../entities/Account.js';
import { Transaction } from '../entities/Transaction.js';

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

    try {
      return await this.userRepository.createAccount(account);
    } catch (error) {
      throw error;
    }
  }

  async createTransaction(data) {
    if (
      !data ||
      !data.userId ||
      !data.fromAccountId ||
      !data.toAccountId ||
      !data.amount
    ) {
      const error = new Error(
        'Missing required fields "fromAccountId", "toAccountId", "amount"',
      );
      error.status = 400;
      throw error;
    }

    try {
      const userIsOwnershipOfAccount =
        await this.userRepository.checkAccountOwnership(
          data.fromAccountId,
          data.userId,
        );

      if (!userIsOwnershipOfAccount) {
        const error = new Error('Account not linked to the user');
        error.status = 401;
        throw error;
      }

      const hasEnoughBalance = await this.userRepository.getAccountBalance(
        data.fromAccountId,
      );

      if (hasEnoughBalance < data.amount) {
        const error = new Error(
          'Insufficient balance to complete this transaction',
        );
        error.status = 400;
        throw error;
      }

      const transaction = new Transaction(data);

      return await this.userRepository.createTransaction(transaction);
    } catch (error) {
      throw error;
    }
  }

  async getBalance(data) {
    if (!data.userId) {
      const error = new Error('userId is required');
      error.status = 400;
      throw error;
    }

    try {
      const balance = await this.userRepository.getBalance(data);

      if (balance.total_balance == null) {
        const error = new Error('User or Institution not found');
        error.status = 404;
        throw error;
      }

      return balance;
    } catch (error) {
      throw error;
    }
  }

  async getStatement(data) {
    if (!data || !data.userId) {
      const error = new Error('Missing required field "userId"');
      error.status = 400;
      throw error;
    }

    const { userId, institution } = data;

    try {
      const statement = await this.userRepository.getStatement(
        userId,
        institution,
      );

      const receivedAmount = statement.reduce(
        (acc, current_value) => acc + parseFloat(current_value.received_amount),
        0,
      );
      const sentAmount = statement.reduce(
        (acc, current_value) => acc + parseFloat(current_value.sent_amount),
        0,
      );

      return { user: { userId, receivedAmount, sentAmount, statement } };
    } catch (error) {
      throw error;
    }
  }
}

export { UserService };
