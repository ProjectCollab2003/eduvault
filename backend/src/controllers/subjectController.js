import { subjectRepository } from "../repositories/subjectRepository.js";

export const subjectController = {
  async getSubjects(req, res, next) {
    try {
      const gradeId = req.query.grade_id ? Number(req.query.grade_id) : undefined;
      const subjects = await subjectRepository.findAll({ gradeId, userId: req.user?.user_id });

      res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSubjectById(req, res, next) {
    try {
      const { id } = req.params;
      const subject = await subjectRepository.findById(Number(id), req.user?.user_id);

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  async createSubject(req, res, next) {
    try {
      const { grade_id, name, description } = req.body;

      if (!grade_id) {
        return res.status(400).json({ success: false, message: "Grade is required." });
      }

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Subject name is required." });
      }

      const exists = await subjectRepository.findByGradeAndName(Number(grade_id), name);
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "This subject already exists for the selected grade.",
        });
      }

      const subject = await subjectRepository.create({
        grade_id: Number(grade_id),
        name,
        description,
      });

      res.status(201).json({
        success: true,
        message: "Subject created successfully.",
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSubject(req, res, next) {
    try {
      const { id } = req.params;
      const { grade_id, name, description } = req.body;

      const subject = await subjectRepository.update(Number(id), {
        grade_id: grade_id ? Number(grade_id) : undefined,
        name,
        description,
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Subject updated successfully.",
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSubject(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await subjectRepository.delete(Number(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Subject deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
};
