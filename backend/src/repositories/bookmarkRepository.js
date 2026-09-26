import pool from "../config/db.js";
import { Bookmark } from "../entities/Bookmark.js";

export const bookmarkRepository = {
  async findByUserId(userId) {
    const query = `
      SELECT 
        b.bookmark_id,
        b.user_id,
        b.material_id,
        b.created_at,
        m.title,
        m.file_url,
        m.public_id,
        m.resource_type,
        m.thumbnail_url,
        s.name AS subject_name,
        g.name AS grade_name,
        c.name AS category_name
      FROM bookmarks b
      JOIN materials m ON b.material_id = m.material_id
      JOIN subjects s ON m.subject_id = s.subject_id
      JOIN grades g ON s.grade_id = g.grade_id
      JOIN material_categories c ON m.category_id = c.category_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.map((row) => new Bookmark(row));
  },

  async add(userId, materialId) {
    const query = `
      INSERT INTO bookmarks (user_id, material_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, material_id) DO NOTHING
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, materialId]);
    return rows[0] ? new Bookmark(rows[0]) : null;
  },

  async remove(userId, materialId) {
    const query = `
      DELETE FROM bookmarks
      WHERE user_id = $1 AND material_id = $2
    `;
    const { rowCount } = await pool.query(query, [userId, materialId]);
    return rowCount > 0;
  },

  async isBookmarked(userId, materialId) {
    const query = `
      SELECT 1 FROM bookmarks
      WHERE user_id = $1 AND material_id = $2
      LIMIT 1
    `;
    const { rowCount } = await pool.query(query, [userId, materialId]);
    return rowCount > 0;
  },
};
