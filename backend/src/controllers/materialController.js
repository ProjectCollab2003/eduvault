import { materialRepository } from "../repositories/materialRepository.js";
import { categoryRepository } from "../repositories/categoryRepository.js";

export const materialController = {
  async getCategories(req, res, next) {
    try { res.json({ success: true, data: await categoryRepository.findAll() }); }
    catch (error) { next(error); }
  },
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
        user_id: req.user?.user_id,
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
        user_id: req.user?.user_id,
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
      const material = await materialRepository.findById(Number(id), req.user?.user_id);

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

  async uploadMaterial(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        data: {
          file_url: fileUrl,
          file_name: req.file.originalname,
          file_size: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async createMaterial(req, res, next) {
    try {
      const { subject_id, category_id, title, description, academic_year, term, file_url, public_id, thumbnail_url } = req.body;

      if (!subject_id || !category_id || !title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Subject, category, and title are required.",
        });
      }

      const material = await materialRepository.create({
        subject_id: Number(subject_id),
        category_id: Number(category_id),
        title,
        description,
        academic_year: academic_year ? Number(academic_year) : null,
        term: term ? Number(term) : null,
        file_url: file_url || null,
        public_id: public_id || null,
        thumbnail_url: thumbnail_url || null,
      });

      res.status(201).json({
        success: true,
        message: "Material created successfully.",
        data: material,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateMaterial(req, res, next) {
    try {
      const { id } = req.params;
      const { subject_id, category_id, title, description, academic_year, term, file_url, public_id, thumbnail_url } = req.body;

      const material = await materialRepository.update(Number(id), {
        subject_id: subject_id !== undefined ? Number(subject_id) : undefined,
        category_id: category_id !== undefined ? Number(category_id) : undefined,
        title,
        description,
        academic_year: academic_year !== undefined ? Number(academic_year) : undefined,
        term: term !== undefined ? Number(term) : undefined,
        file_url,
        public_id,
        thumbnail_url,
      });

      if (!material) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Material updated successfully.",
        data: material,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteMaterial(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await materialRepository.delete(Number(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Material deleted successfully.",
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
