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

  async getBalance(userId) {
    const query = `
      SELECT sum(balance) as balance FROM accounts WHERE user_id = $1
    `;

    const result = await database.query(query, [userId]);

    return result.rows[0];
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
