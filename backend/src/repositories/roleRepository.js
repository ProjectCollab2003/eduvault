import pool from "../config/db.js";
import { Role } from "../entities/Role.js";

export const roleRepository = {
  async findAll() {
    const { rows } = await pool.query("SELECT * FROM roles ORDER BY role_id ASC");
    return rows.map((row) => new Role(row));
  },

  async findByName(name) {
    const { rows } = await pool.query("SELECT * FROM roles WHERE UPPER(name) = UPPER($1)", [name]);
    return rows[0] ? new Role(rows[0]) : null;
  },

  async findById(id) {
    const { rows } = await pool.query("SELECT * FROM roles WHERE role_id = $1", [id]);
    return rows[0] ? new Role(rows[0]) : null;
  },
};
