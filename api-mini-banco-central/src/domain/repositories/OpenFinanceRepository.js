import { database } from '../../shared/config/db.js';
import { UserRepository } from './UserRepository.js';

const userRepository = new UserRepository();

class OpenFinanceRepository {
  async consent({ cpf, expiration, expirationDate }) {
    const createAuthorizationQuery = `
        INSERT INTO open_finance (institution_id, account_id, agency, status, expiration, expiration_date)
        VALUES ($1, $2, $3, $4, $5, $6);
    `;

    const getUserAccountQuery = `SELECT 'Itaú' as name,
    accounts.account_number as account, accounts.id as "accountId", institution_agencies.agency_code as agency
    FROM users
    JOIN accounts ON users.id = accounts.user_id
    JOIN institution_agencies ON accounts.institution_agency_id = institution_agencies.id
    WHERE cpf = $1`;

    try {
      const { rows } = await database.query(getUserAccountQuery, [cpf]);

      if (rows.length == 0) {
        const error = new Error('Conta não encontrada');
        error.status = 404;
        throw error;
      }

      await database.query(createAuthorizationQuery, [
        1,
        rows[0].accountId,
        rows[0].agency,
        'accepted',
        expiration,
        expiration ? expirationDate : null,
      ]);

      return rows[0];
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
    const user = await userRepository.findByCpf(cpf);

    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }

    const findAccountQuery = `SELECT * FROM accounts WHERE user_id = $1`;
    const updateQuery = `UPDATE open_finance SET status = $1, expiration = $2, expiration_date = $3 WHERE account_id = $4 RETURNING agency`;

    try {
      const account = await database.query(findAccountQuery, [user.id]);

      const update = await database.query(updateQuery, [
        action,
        expiration,
        expirationDate,
        account.rows[0].id,
      ]);

      return {
        account: account.rows[0].account_number,
        agency: update.rows[0].agency,
      };
    } catch (error) {
      throw error;
    }
  }

  async getBalance(account) {
    try {
      const query = `SELECT balance FROM accounts JOIN open_finance ON accounts.id = open_finance.account_id WHERE accounts.account_number = $1`;

      const { rows } = await database.query(query, [account]);

      if (rows.length == 0) {
        const error = new Error(
          'Conta não está compartilhada via open finance',
        );
        error.status = 400;
        throw error;
      }

      return rows[0].balance;
    } catch (error) {
      throw error;
    }
  }

  async createTransaction(account, amount) {
    const accountQuery = `SELECT accounts.id as id, balance, open_finance.id as of_id FROM accounts JOIN open_finance ON accounts.id = open_finance.account_id WHERE account_number = $1`;

    const createTransactionQuery = `INSERT INTO open_finance_transactions (open_finance_id, account_id, amount) VALUES ($1, $2, $3)`;

    const updateAccountBalanceQuery = `UPDATE accounts SET balance = $1 WHERE account_number = $2`;

    try {
      const accountResult = await database.query(accountQuery, [account]);

      if (accountResult.rows.length == 0) {
        const error = new Error(
          'Conta não está compartilhada via open finance',
        );
        error.status = 400;
        throw error;
      }

      if (accountResult.rows[0].balance < amount) {
        const error = new Error('A conta não possui saldo suficiente');
        error.status = 400;
        throw error;
      }

      await database.query(createTransactionQuery, [
        accountResult.rows[0].of_id,
        accountResult.rows[0].id,
        amount,
      ]);

      await database.query(updateAccountBalanceQuery, [
        accountResult.rows[0].balance - amount,
        account,
      ]);

      return { balance: accountResult.rows[0].balance - amount };
    } catch (error) {
      throw error;
    }
  }
}

export { OpenFinanceRepository };
