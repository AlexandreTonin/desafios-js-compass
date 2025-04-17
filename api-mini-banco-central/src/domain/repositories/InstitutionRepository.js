import { database } from '../../shared/config/db.js';

class InstitutionRepository {
  async create(institution) {
    const { name } = institution;

    const query = `
      INSERT INTO institutions(name) VALUES ($1) RETURNING id, name, created_at AS "createdAt"
    `;

    const result = await database.query(query, [name]);

    return result.rows[0];
  }

  async findAll({ limit, offset }) {
    const query = `
      SELECT id, name, created_at as "createdAt" FROM institutions LIMIT $1 OFFSET $2
    `;

    const result = await database.query(query, [limit, offset]);

    return result;
  }

  async count() {
    const query = `
      SELECT COUNT(*) FROM institutions
    `;

    const result = await database.query(query);

    return result.rows[0].count;
  }

  async findOne(id) {
    const query = `
      SELECT id, name, created_at as "createdAt" FROM institutions WHERE id = $1
    `;

    const result = await database.query(query, [id]);

    return result.rows[0];
  }

  async institutionExists(id) {
    const query = `
    SELECT * FROM institutions WHERE id = $1
  `;

    const result = await database.query(query, [id]);

    // Return boolean indicating whether the institution exists
    return result.rows.length > 0 ? true : false;
  }
}

export { InstitutionRepository };
