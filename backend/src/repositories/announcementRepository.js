import pool from "../config/db.js";
import { Announcement } from "../entities/Announcement.js";

export const announcementRepository = {
  async findAll({ limit = 20, offset = 0 } = {}) {
    const query = `
      SELECT a.*, u.name AS admin_name
      FROM announcements a
      JOIN users u ON a.admin_id = u.user_id
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows.map((row) => new Announcement(row));
  },

  async findById(id) {
    const query = `
      SELECT a.*, u.name AS admin_name
      FROM announcements a
      JOIN users u ON a.admin_id = u.user_id
      WHERE a.announcement_id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] ? new Announcement(rows[0]) : null;
  },

  async create({ admin_id, title, message, published_at = new Date() }) {
    const query = `
      INSERT INTO announcements (admin_id, title, message, published_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [admin_id, title.trim(), message.trim(), published_at]);
    return this.findById(rows[0].announcement_id);
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM announcements WHERE announcement_id = $1", [
      id,
    ]);
    return rowCount > 0;
  },
};
