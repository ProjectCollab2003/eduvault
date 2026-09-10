import pool from "../config/db.js";

export const platformController = {
  async getStats(req, res, next) {
    try {
      const query = `
        SELECT
          (SELECT COUNT(*)::int FROM materials) AS total_materials,
          (SELECT COUNT(*)::int FROM grades) AS total_grades,
          (SELECT COUNT(*)::int FROM subjects) AS total_subjects,
          (SELECT COALESCE(SUM(download_count), 0)::int FROM materials) AS total_downloads
      `;
      const { rows } = await pool.query(query);

      res.status(200).json({
        success: true,
        data: {
          totalMaterials: rows[0].total_materials,
          totalGrades: rows[0].total_grades,
          totalSubjects: rows[0].total_subjects,
          totalDownloads: rows[0].total_downloads,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
