import { InstitutionRepository } from '../../domain/repositories/InstitutionRepository.js';
import { InstitutionService } from '../../domain/services/InstitutionService.js';
import { logger } from '../../infra/logger/logger.js';
import { getPaginationParams } from '../../shared/helpers/pagination.js';

const institutionRepository = new InstitutionRepository();
const institutionService = new InstitutionService(institutionRepository);

const institutionController = {
  async create(req, res) {
    const data = req.body;

    try {
      const institution = await institutionService.create(data);

      res.status(201).json({
        success: true,
        message: 'Instituição criada com sucesso',
        data: institution,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      logger.error(error, message);

      return res.status(status).json({
        success: false,
        message,
      });
    }
  },

  async findAll(req, res) {
    const { page, limit } = getPaginationParams(req.query);

    try {
      const institutions = await institutionService.findAll({ page, limit });

      res.status(201).json({
        success: true,
        data: institutions.data,
        pagination: institutions.pagination,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      logger.error(error, message);

      return res.status(status).json({
        success: false,
        message,
      });
    }
  },

  async findOne(req, res) {
    const id = req.params.id;

    try {
      const institution = await institutionService.findOne(id);

      res.status(201).json({
        success: true,
        data: institution,
      });
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';

      logger.error(error, message);

      return res.status(status).json({
        success: false,
        message,
      });
    }
  },
};

export { institutionController };
