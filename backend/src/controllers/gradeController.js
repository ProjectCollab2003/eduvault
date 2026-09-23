import { gradeRepository } from "../repositories/gradeRepository.js";

export const gradeController = {
  async getGrades(req, res, next) {
    try {
      const grades = await gradeRepository.findAll();
      res.status(200).json({
        success: true,
        data: grades,
      });
    } catch (error) {
      next(error);
    }
  },

  async getGradeById(req, res, next) {
    try {
      const { id } = req.params;
      const grade = await gradeRepository.findById(Number(id));

      if (!grade) {
        return res.status(404).json({
          success: false,
          message: "Grade not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: grade,
      });
    } catch (error) {
      next(error);
    }
  },

  async createGrade(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Grade name is required.",
        });
      }

      const existing = await gradeRepository.findByName(name);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Grade already exists.",
        });
      }

      const grade = await gradeRepository.create({ name, description });

      res.status(201).json({
        success: true,
        message: "Grade created successfully.",
        data: grade,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateGrade(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const grade = await gradeRepository.update(Number(id), { name, description });

      if (!grade) {
        return res.status(404).json({
          success: false,
          message: "Grade not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Grade updated successfully.",
        data: grade,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteGrade(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await gradeRepository.delete(Number(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Grade not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Grade deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
};
