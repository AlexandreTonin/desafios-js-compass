import { InstitutionRepository } from '../repositories/InstitutionRepository.js';
import { Institution } from '../entities/Institution.js';
import {
  getPaginationOffset,
  getPaginationTotalPages,
} from '../../shared/helpers/pagination.js';

class InstitutionService {
  constructor() {
    this.institutionRepository = new InstitutionRepository();
  }

  async create(data) {
    // Validate required fields before attempting to create an institution
    if (!data || !data.name) {
      const error = new Error('Name is required');
      error.status = 400;
      throw error;
    }

    try {
      const institution = new Institution(data);
      return await this.institutionRepository.create(institution);
    } catch (error) {
      throw error;
    }
  }

  async findAll({ page, limit }) {
    const offset = getPaginationOffset({ page, limit });

    try {
      const institutions = await this.institutionRepository.findAll({
        limit,
        offset,
      });
      const total = await this.institutionRepository.count();

      const totalPages = getPaginationTotalPages({ total, limit });

      return {
        data: institutions.rows,
        pagination: {
          total: Number(total),
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id) {
    try {
      const institutions = await this.institutionRepository.findOne(id);
      return institutions;
    } catch (error) {
      throw error;
    }
  }
}

export { InstitutionService };
