import { materialRepository } from "../repositories/materialRepository.js";

export const materialController = {
  async getMaterials(req, res, next) {
    try {
      const {
        grade_id,
        subject_id,
        category_id,
        term,
        academic_year,
        search,
        sortBy,
        sortOrder,
        limit,
        offset,
      } = req.query;

      const materials = await materialRepository.findAll({
        grade_id: grade_id ? Number(grade_id) : undefined,
        subject_id: subject_id ? Number(subject_id) : undefined,
        category_id: category_id ? Number(category_id) : undefined,
        term: term ? Number(term) : undefined,
        academic_year: academic_year ? Number(academic_year) : undefined,
        search,
        sortBy,
        sortOrder,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      });

      res.status(200).json({
        success: true,
        count: materials.length,
        data: materials,
      });
    } catch (error) {
      next(error);
    }
  },

  async getRecentMaterials(req, res, next) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const materials = await materialRepository.findAll({
        sortBy: "created_at",
        sortOrder: "DESC",
        limit,
        offset: 0,
      });

      res.status(200).json({
        success: true,
        data: materials,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMaterialById(req, res, next) {
    try {
      const { id } = req.params;
      const material = await materialRepository.findById(Number(id));

      if (!material) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: material,
      });
    } catch (error) {
      next(error);
    }
  },

  async incrementView(req, res, next) {
    try {
      const { id } = req.params;
      const views = await materialRepository.incrementViewCount(Number(id));

      if (views === null) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: { view_count: views },
      });
    } catch (error) {
      next(error);
    }
  },

  async incrementDownload(req, res, next) {
    try {
      const { id } = req.params;
      const downloads = await materialRepository.incrementDownloadCount(Number(id));

      if (downloads === null) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: { download_count: downloads },
      });
    } catch (error) {
      next(error);
    }
  },
};
