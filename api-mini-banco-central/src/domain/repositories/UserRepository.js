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
}

export { UserRepository };
