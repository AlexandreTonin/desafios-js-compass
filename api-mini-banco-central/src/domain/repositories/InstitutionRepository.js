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

  async findAll() {
    const query = `
      SELECT * FROM institutions
    `;

    const result = await database.query(query);

    return result.rows;
  }

  async findOne(id) {
    const query = `
      SELECT * FROM institutions WHERE id = $1
    `;

    const result = await database.query(query, [id]);

    return result.rows[0];
  }

  async institutionExists(id) {
    const query = `
    SELECT * FROM institutions WHERE id = $1
  `;

    const result = await database.query(query, [id]);

    return result.rows.length > 0 ? true : false;
  }
}

export { InstitutionRepository };
