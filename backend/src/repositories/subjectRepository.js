import pool from "../config/db.js";
import { Subject } from "../entities/Subject.js";

export const subjectRepository = {
  async findAll({ gradeId } = {}) {
    let query = `
      SELECT s.*, g.name AS grade_name, COUNT(m.material_id)::int AS material_count
      FROM subjects s
      JOIN grades g ON s.grade_id = g.grade_id
      LEFT JOIN materials m ON s.subject_id = m.subject_id
    `;
    const params = [];

    if (gradeId) {
      query += ` WHERE s.grade_id = $1`;
      params.push(gradeId);
    }

    query += `
      GROUP BY s.subject_id, g.grade_id, g.name
      ORDER BY g.grade_id ASC, s.name ASC
    `;

    const { rows } = await pool.query(query, params);
    return rows.map((row) => new Subject(row));
  },

  async findById(id) {
    const query = `
      SELECT s.*, g.name AS grade_name, COUNT(m.material_id)::int AS material_count
      FROM subjects s
      JOIN grades g ON s.grade_id = g.grade_id
      LEFT JOIN materials m ON s.subject_id = m.subject_id
      WHERE s.subject_id = $1
      GROUP BY s.subject_id, g.grade_id, g.name
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] ? new Subject(rows[0]) : null;
  },

  async findByGradeAndName(gradeId, name) {
    const query = `
      SELECT s.*, g.name AS grade_name
      FROM subjects s
      JOIN grades g ON s.grade_id = g.grade_id
      WHERE s.grade_id = $1 AND UPPER(s.name) = UPPER($2)
    `;
    const { rows } = await pool.query(query, [gradeId, name.trim()]);
    return rows[0] ? new Subject(rows[0]) : null;
  },

  async create({ grade_id, name, description }) {
    const query = `
      INSERT INTO subjects (grade_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [grade_id, name.trim(), description || null]);
    return new Subject(rows[0]);
  },

  async update(id, { name, description, grade_id }) {
    const query = `
      UPDATE subjects
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          grade_id = COALESCE($3, grade_id)
      WHERE subject_id = $4
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name ? name.trim() : null,
      description !== undefined ? description : null,
      grade_id || null,
      id,
    ]);
    return rows[0] ? new Subject(rows[0]) : null;
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM subjects WHERE subject_id = $1", [id]);
    return rowCount > 0;
  },
};
