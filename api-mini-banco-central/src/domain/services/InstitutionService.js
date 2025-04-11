import { InstitutionRepository } from '../repositories/InstitutionRepository.js';
import { Institution } from '../entities/Institution.js';

class InstitutionService {
  constructor() {
    this.institutionRepository = new InstitutionRepository();
  }

  async create(data) {
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
}

export { InstitutionService };
