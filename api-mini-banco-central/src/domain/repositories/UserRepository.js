import { database } from '../../shared/config/db.js';

class UserRepository {
  async createAccount(account) {
    const { userId, institutionId } = account;

    const query = `
      INSERT INTO accounts(user_id, institution_id) VALUES ($1, $2) RETURNING *
    `;

    const result = await database.query(query, [userId, institutionId]);

    return result.rows[0];
  }

  async createTransaction(transaction) {
    const { userId, fromAccountId, toAccountId, amount, description } =
      transaction;

    const createTransactionQuery = `
      INSERT INTO transactions(from_account_id, to_account_id, transaction_type, amount, description, status) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;

    const result = await database.query(createTransactionQuery, [
      fromAccountId,
      toAccountId,
      'transfer',
      amount,
      description,
      'completed',
    ]);

    const updateFromAccountBalanceQuery = `
      UPDATE accounts SET balance = balance - $1 WHERE id = $2
    `;

    await database.query(updateFromAccountBalanceQuery, [
      amount,
      fromAccountId,
    ]);

    const updateToAccountBalanceQuery = `
    UPDATE accounts SET balance = balance + $1 WHERE id = $2
  `;

    await database.query(updateToAccountBalanceQuery, [amount, toAccountId]);

    return result.rows[0];
  }

  async getBalance(account) {
    const { userId, institution } = account;
    const hasInstitution = !!institution;

    const params = hasInstitution ? [userId, institution] : [userId];

    const baseQuery = `
      FROM accounts
      INNER JOIN institutions ON accounts.institution_id = institutions.id
      WHERE user_id = $1
    `;

    const filter = hasInstitution
      ? `AND unaccent(institutions.name) ILIKE unaccent($2)`
      : '';

    const accountsQuery = `
      SELECT institutions.name AS institution, accounts.balance
      ${baseQuery} ${filter}
    `;

    const balanceQuery = `
      SELECT SUM(accounts.balance) AS balance
      ${baseQuery} ${filter}
    `;

    const [accountsResult, balanceResult] = await Promise.all([
      database.query(accountsQuery, params),
      database.query(balanceQuery, params),
    ]);

    return {
      total_balance: balanceResult.rows[0].balance,
      accounts: accountsResult.rows,
    };
  }

  async getStatement() {}

  async getAccounts(userId) {
    const query = `
      SELECT * FROM accounts WHERE user_id = $1
    `;

    const result = await database.query(query, [userId]);

    return result.rows;
  }

  async getAccountBalance(accountId) {
    const query = `
      SELECT balance FROM accounts WHERE id = $1
    `;

    const result = await database.query(query, [accountId]);

    return result.rows[0].balance;
  }

  async checkAccountOwnership(accountId, userId) {
    const query = `
      SELECT * FROM accounts WHERE id = $1 and user_id = $2
    `;

    const result = await database.query(query, [accountId, userId]);

    return result.rows.length > 0 ? true : false;
  }
}

export { UserRepository };
