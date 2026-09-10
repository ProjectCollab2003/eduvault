import pool from "../config/db.js";
import { Grade } from "../entities/Grade.js";

export const gradeRepository = {
  async findAll() {
    const query = `
      SELECT 
        g.*, 
        COUNT(DISTINCT s.subject_id)::int AS subject_count,
        COUNT(DISTINCT m.material_id)::int AS material_count
      FROM grades g
      LEFT JOIN subjects s ON g.grade_id = s.grade_id
      LEFT JOIN materials m ON s.subject_id = m.subject_id
      GROUP BY g.grade_id
      ORDER BY g.grade_id ASC
    `;
    const { rows } = await pool.query(query);
    return rows.map((row) => new Grade(row));
  },

  async findById(id) {
    const query = `
      SELECT 
        g.*, 
        COUNT(DISTINCT s.subject_id)::int AS subject_count,
        COUNT(DISTINCT m.material_id)::int AS material_count
      FROM grades g
      LEFT JOIN subjects s ON g.grade_id = s.grade_id
      LEFT JOIN materials m ON s.subject_id = m.subject_id
      WHERE g.grade_id = $1
      GROUP BY g.grade_id
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] ? new Grade(rows[0]) : null;
  },

  async findByName(name) {
    const query = `SELECT * FROM grades WHERE UPPER(name) = UPPER($1)`;
    const { rows } = await pool.query(query, [name.trim()]);
    return rows[0] ? new Grade(rows[0]) : null;
  },

  async create({ name, description }) {
    const query = `
      INSERT INTO grades (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name.trim(), description || null]);
    return new Grade(rows[0]);
  },

  async update(id, { name, description }) {
    const query = `
      UPDATE grades
      SET name = COALESCE($1, name),
          description = COALESCE($2, description)
      WHERE grade_id = $3
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name ? name.trim() : null,
      description !== undefined ? description : null,
      id,
    ]);
    return rows[0] ? new Grade(rows[0]) : null;
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM grades WHERE grade_id = $1", [id]);
    return rowCount > 0;
  },
};
