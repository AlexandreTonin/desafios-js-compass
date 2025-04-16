import { database } from '../../shared/config/db.js';

class UserRepository {
  async createUser(user) {
    const { name } = user;

    const query = `
      INSERT INTO users(name) VALUES ($1) RETURNING id, name, created_at AS "createdAt"
    `;

    const result = await database.query(query, [name]);

    return result.rows[0];
  }

  async createAccount(account) {
    const { userId, institutionId } = account;

    const query = `
      INSERT INTO accounts(user_id, institution_id) VALUES ($1, $2) RETURNING id, user_id AS "userId", institution_id AS "institutionId", balance, created_at AS "createdAt"
    `;

    const result = await database.query(query, [userId, institutionId]);

    return result.rows[0];
  }

  async createTransaction(transaction) {
    const { fromAccountId, toAccountId, amount, description } = transaction;

    const createTransactionQuery = `
      INSERT INTO transactions(from_account_id, to_account_id, transaction_type, amount, description, status) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, from_account_id AS "fromAccountId", to_account_id AS "toAccountId", transaction_type AS "transactionType", amount, description, status, created_at AS "createdAt"
    `;

    const result = await database.query(createTransactionQuery, [
      fromAccountId,
      toAccountId,
      'transfer',
      amount,
      description,
      'completed',
    ]);

    // Update balances atomically - first deduct from source account
    const updateFromAccountBalanceQuery = `
      UPDATE accounts SET balance = balance - $1 WHERE id = $2
    `;

    await database.query(updateFromAccountBalanceQuery, [
      amount,
      fromAccountId,
    ]);

    // Then add to destination account
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

    // Filter by institution name if provided, using case-insensitive search with accent support
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
      totalBalance: balanceResult.rows[0].balance,
      accounts: accountsResult.rows,
    };
  }

  async getStatement(userId, institution) {
    let query = `
      SELECT 
        transactions.id AS "transactionId",
        transactions.from_account_id AS "fromAccountId",
        transactions.to_account_id AS "toAccountId",
        transactions.transaction_type AS "transactionType",
        transactions.description as "transactionDescription",
        transactions.status as "transactionStatus",
        transactions.created_at as "transactionCreatedAt",
        from_acc.user_id AS "fromUserId",
        to_acc.user_id AS "toUserId",
        from_inst.name AS "fromInstitution",
        to_inst.name AS "toInstitution",
        CASE 
          WHEN from_acc.user_id = $1 THEN transactions.amount 
          ELSE 0 
        END AS "sentAmount",
        CASE 
          WHEN to_acc.user_id = $1 THEN transactions.amount 
          ELSE 0 
        END AS "receivedAmount"
      FROM transactions
      INNER JOIN accounts AS from_acc ON transactions.from_account_id = from_acc.id
      INNER JOIN accounts AS to_acc ON transactions.to_account_id = to_acc.id
      INNER JOIN institutions AS from_inst ON from_acc.institution_id = from_inst.id
      INNER JOIN institutions AS to_inst ON to_acc.institution_id = to_inst.id
      WHERE (from_acc.user_id = $1 OR to_acc.user_id = $1)
  `;

    if (institution) {
      query += `
        AND (
          unaccent(from_inst.name) ILIKE unaccent($2)
          OR unaccent(to_inst.name) ILIKE unaccent($2)
        )
    `;
    }

    const result = await database.query(
      query,
      institution ? [userId, institution] : [userId],
    );

    return result.rows;
  }

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

  async getUserById(userId) {
    const query = `
      SELECT * FROM users WHERE id = $1
    `;

    const result = await database.query(query, [userId]);

    return result.rows[0];
  }

  async userExists(userId) {
    const query = `
      SELECT * FROM users WHERE id = $1
    `;

    const result = await database.query(query, [userId]);

    // Return boolean indicating whether the institution exists
    return result.rows.length > 0 ? true : false;
  }
}

export { UserRepository };
