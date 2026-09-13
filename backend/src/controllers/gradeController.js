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
};
