import pool from "../config/db.js";
import { User } from "../entities/User.js";

export const userRepository = {
  async create({ role_id, grade_id, name, email, password, verification_token_hash, verification_expires_at }) {
    const query = `
      INSERT INTO users (role_id, grade_id, name, email, password, verification_token_hash, verification_expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      role_id,
      grade_id || null,
      name.trim(),
      email.toLowerCase().trim(),
      password,
      verification_token_hash || null,
      verification_expires_at || null,
    ]);
    return this.findById(rows[0].user_id);
  },

  async findByEmail(email) {
    const query = `
      SELECT u.*, r.name AS role_name, g.name AS grade_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN grades g ON u.grade_id = g.grade_id
      WHERE LOWER(u.email) = LOWER($1)
    `;
    const { rows } = await pool.query(query, [email.trim()]);
    return rows[0] ? new User(rows[0]) : null;
  },

  async verifyEmail(tokenHash) {
    const query = `
      UPDATE users
      SET email_verified_at = CURRENT_TIMESTAMP,
          verification_token_hash = NULL,
          verification_expires_at = NULL
      WHERE verification_token_hash = $1
        AND verification_expires_at > CURRENT_TIMESTAMP
      RETURNING user_id
    `;
    const { rows } = await pool.query(query, [tokenHash]);
    return rows[0] || null;
  },

  async findById(id) {
    const query = `
      SELECT u.*, r.name AS role_name, g.name AS grade_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN grades g ON u.grade_id = g.grade_id
      WHERE u.user_id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] ? new User(rows[0]) : null;
  },

  async findAll({ roleName } = {}) {
    let query = `
      SELECT u.*, r.name AS role_name, g.name AS grade_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN grades g ON u.grade_id = g.grade_id
    `;
    const params = [];

    if (roleName) {
      query += ` WHERE UPPER(r.name) = UPPER($1)`;
      params.push(roleName);
    }

    query += ` ORDER BY u.created_at DESC`;

    const { rows } = await pool.query(query, params);
    return rows.map((row) => new User(row));
  },

  async update(id, { name, email, grade_id }) {
    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          grade_id = COALESCE($3, grade_id)
      WHERE user_id = $4
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      name ? name.trim() : null,
      email ? email.toLowerCase().trim() : null,
      grade_id || null,
      id,
    ]);
    if (!rows[0]) return null;
    return this.findById(id);
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    return rowCount > 0;
  },
};
