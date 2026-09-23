import pool from "../config/db.js";

const materialSelect = `
  SELECT m.*, s.name AS subject_name, g.grade_id, g.name AS grade_name,
         c.name AS category_name,
         EXISTS (SELECT 1 FROM bookmarks b WHERE b.material_id = m.material_id AND b.user_id = $1) AS is_bookmarked
  FROM materials m
  JOIN subjects s ON s.subject_id = m.subject_id
  JOIN grades g ON g.grade_id = s.grade_id
  JOIN material_categories c ON c.category_id = m.category_id`;

export const studentRepository = {
  async getBookmarks(userId) {
    const { rows } = await pool.query(`${materialSelect}
      JOIN bookmarks own_bookmark ON own_bookmark.material_id = m.material_id AND own_bookmark.user_id = $1
      ORDER BY own_bookmark.created_at DESC`, [userId]);
    const subjects = await pool.query(`
      SELECT s.*, g.name AS grade_name, COUNT(m.material_id)::int AS material_count, TRUE AS is_bookmarked
      FROM subject_bookmarks sb
      JOIN subjects s ON s.subject_id = sb.subject_id
      JOIN grades g ON g.grade_id = s.grade_id
      LEFT JOIN materials m ON m.subject_id = s.subject_id
      WHERE sb.user_id = $1
      GROUP BY s.subject_id, g.name, sb.created_at
      ORDER BY sb.created_at DESC`, [userId]);
    return { materials: rows, subjects: subjects.rows };
  },

  async addSubjectBookmark(userId, subjectId) {
    await pool.query(`INSERT INTO subject_bookmarks (user_id, subject_id) VALUES ($1, $2)
      ON CONFLICT (user_id, subject_id) DO NOTHING`, [userId, subjectId]);
  },

  async removeSubjectBookmark(userId, subjectId) {
    await pool.query("DELETE FROM subject_bookmarks WHERE user_id = $1 AND subject_id = $2", [userId, subjectId]);
  },

  async recordAccess(userId, materialId) {
    await pool.query(`
      INSERT INTO material_access_history (user_id, material_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, material_id) DO UPDATE
      SET last_accessed_at = CURRENT_TIMESTAMP,
          access_count = material_access_history.access_count + 1`, [userId, materialId]);
  },

  async getRecentAccess(userId, limit = 8) {
    const { rows } = await pool.query(`${materialSelect}
      JOIN material_access_history h ON h.material_id = m.material_id AND h.user_id = $1
      ORDER BY h.last_accessed_at DESC LIMIT $2`, [userId, limit]);
    return rows;
  },

  async getDashboard(userId) {
    const [counts, bookmarks, recent, announcements, grades] = await Promise.all([
      pool.query(`SELECT
        ((SELECT COUNT(*)::int FROM bookmarks WHERE user_id = $1) +
         (SELECT COUNT(*)::int FROM subject_bookmarks WHERE user_id = $1)) AS bookmark_count,
        (SELECT COALESCE(SUM(access_count), 0)::int FROM material_access_history WHERE user_id = $1) AS access_count`, [userId]),
      pool.query(`${materialSelect}
        JOIN bookmarks own_bookmark ON own_bookmark.material_id = m.material_id AND own_bookmark.user_id = $1
        ORDER BY own_bookmark.created_at DESC LIMIT 4`, [userId]),
      this.getRecentAccess(userId, 6),
      pool.query(`SELECT * FROM announcements WHERE published_at IS NOT NULL AND published_at <= CURRENT_TIMESTAMP
        ORDER BY is_important DESC, published_at DESC LIMIT 2`),
      pool.query(`SELECT g.*, COUNT(DISTINCT s.subject_id)::int AS subject_count,
        COUNT(DISTINCT m.material_id)::int AS material_count
        FROM grades g LEFT JOIN subjects s ON s.grade_id = g.grade_id
        LEFT JOIN materials m ON m.subject_id = s.subject_id
        GROUP BY g.grade_id ORDER BY g.grade_id`),
    ]);
    return {
      stats: counts.rows[0],
      bookmarks: bookmarks.rows,
      recent: recent,
      announcements: announcements.rows,
      grades: grades.rows,
    };
  },
};
