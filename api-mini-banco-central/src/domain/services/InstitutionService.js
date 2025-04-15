import { InstitutionRepository } from '../repositories/InstitutionRepository.js';
import { Institution } from '../entities/Institution.js';

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

  async findAll() {
    try {
      const institutions = await this.institutionRepository.findAll();
      return institutions;
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
