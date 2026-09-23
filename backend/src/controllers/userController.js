import { userRepository } from "../repositories/userRepository.js";

export const userController = {
  async getStudents(req, res, next) {
    try {
      const students = await userRepository.findAll({ roleName: "STUDENT" });

      res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  },

  async getStudentById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await userRepository.findById(Number(id));

      if (!student || student.role_name !== "STUDENT") {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },
};
