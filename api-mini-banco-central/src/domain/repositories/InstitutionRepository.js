import { database } from '../../shared/config/db.js';

class InstitutionRepository {
  async create(institution) {
    const { name } = institution;

    const query = `
      INSERT INTO institutions(name) VALUES ($1) RETURNING *
    `;

    const result = await database.query(query, [name]);

    return result.rows[0];
  }
}

export { InstitutionRepository };
