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

  async getBalance(data) {
    let accountsQuery = `
      SELECT institutions.name as institution, accounts.balance FROM accounts 
      INNER JOIN institutions ON accounts.institution_id = institutions.id 
      WHERE user_id = $1
    `;

    let balanceQuery = `
      SELECT sum(balance) as balance FROM accounts 
      INNER JOIN institutions ON accounts.institution_id = institutions.id 
      WHERE user_id = $1
    `;

    if (data.institution) {
      balanceQuery += `AND unaccent(institutions.name) ILIKE unaccent($2)`;
      accountsQuery += `AND unaccent(institutions.name) ILIKE unaccent($2)`;
    }

    const accountsResult = await database.query(
      accountsQuery,
      !data.institution ? [data.userId] : [data.userId, data.institution],
    );

    const balanceResult = await database.query(
      balanceQuery,
      !data.institution ? [data.userId] : [data.userId, data.institution],
    );

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
