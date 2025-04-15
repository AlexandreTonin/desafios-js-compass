import { UserRepository } from '../repositories/UserRepository.js';
import { Account } from '../entities/Account.js';
import { Transaction } from '../entities/Transaction.js';
import { InstitutionRepository } from '../repositories/InstitutionRepository.js';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.institutionRepository = new InstitutionRepository();
  }

  async createAccount(data) {
    if (!data || !data.institutionId || !data.userId) {
      const error = new Error(
        'Missing required fields "institutionId", "userId"',
      );
      error.status = 400;
      throw error;
    }

    const institutionExists =
      await this.institutionRepository.institutionExists(data.institutionId);

    if (!institutionExists) {
      const error = new Error('Institution not found');
      error.status = 404;
      throw error;
    }

    const userAccounts = await this.userRepository.getAccounts(data.userId);

    // Check if user already has an account in this institution
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
      const userExists = await this.userRepository.getUserById(data.userId);

      if (!userExists) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }

      // Verify that the user owns the account they're trying to transfer from
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

      // Check if the account has sufficient funds for the transaction
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
      const userExists = await this.userRepository.getUserById(data.userId);

      if (!userExists) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }

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

    try {
      const userExists = await this.userRepository.getUserById(data.userId);

      if (!userExists) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }

      const { userId, institution } = data;

      const statement = await this.userRepository.getStatement(
        userId,
        institution,
      );

      // Calculate total amounts received and sent from the transaction history
      const receivedAmount = statement.reduce(
        (acc, current_value) => acc + parseFloat(current_value.receivedAmount),
        0,
      );
      const sentAmount = statement.reduce(
        (acc, current_value) => acc + parseFloat(current_value.sentAmount),
        0,
      );

      return { user: { userId, receivedAmount, sentAmount, statement } };
    } catch (error) {
      throw error;
    }
  }
}

export { UserService };
