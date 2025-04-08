import { InstitutionRepository } from '../repositories/InstitutionRepository';

class InstitutionService {
  constructor() {
    this.InstitutionRepository = new InstitutionRepository();
  }

  async create() {}
}

export { InstitutionService };
