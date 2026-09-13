import { authService } from "../services/authService.js";

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, grade_id } = req.body;
      const result = await authService.registerStudent({
        name,
        email,
        password,
        grade_id,
      });

      res.status(201).json({
        success: true,
        message: "Account created successfully!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.user_id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
