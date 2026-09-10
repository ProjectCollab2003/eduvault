import pool from "../config/db.js";
import { MaterialCategory } from "../entities/MaterialCategory.js";

export const categoryRepository = {
  async findAll() {
    const query = `
      SELECT c.*, COUNT(m.material_id)::int AS material_count
      FROM material_categories c
      LEFT JOIN materials m ON c.category_id = m.category_id
      GROUP BY c.category_id
      ORDER BY c.category_id ASC
    `;
    const { rows } = await pool.query(query);
    return rows.map((row) => new MaterialCategory(row));
  },

  async findById(id) {
    const query = `
      SELECT c.*, COUNT(m.material_id)::int AS material_count
      FROM material_categories c
      LEFT JOIN materials m ON c.category_id = m.category_id
      WHERE c.category_id = $1
      GROUP BY c.category_id
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] ? new MaterialCategory(rows[0]) : null;
  },

  async findByName(name) {
    const query = `SELECT * FROM material_categories WHERE UPPER(name) = UPPER($1)`;
    const { rows } = await pool.query(query, [name.trim()]);
    return rows[0] ? new MaterialCategory(rows[0]) : null;
  },

  async create({ name, description }) {
    const query = `
      INSERT INTO material_categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [name.trim(), description || null]);
    return new MaterialCategory(rows[0]);
  },
};
