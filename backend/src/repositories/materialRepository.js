import pool from "../config/db.js";
import { Material } from "../entities/Material.js";

export const materialRepository = {
  async findAll({
    grade_id,
    subject_id,
    category_id,
    term,
    academic_year,
    search,
    sortBy = "created_at",
    sortOrder = "DESC",
    limit = 50,
    offset = 0,
    user_id,
  } = {}) {
    let query = `
      SELECT 
        m.*,
        s.name AS subject_name,
        g.grade_id,
        g.name AS grade_name,
        c.name AS category_name,
        EXISTS (SELECT 1 FROM bookmarks b WHERE b.material_id = m.material_id AND b.user_id = $1) AS is_bookmarked
      FROM materials m
      JOIN subjects s ON m.subject_id = s.subject_id
      JOIN grades g ON s.grade_id = g.grade_id
      JOIN material_categories c ON m.category_id = c.category_id
      WHERE 1=1
    `;
    const params = [user_id || 0];
    let paramIndex = 2;

    if (grade_id) {
      query += ` AND g.grade_id = $${paramIndex++}`;
      params.push(grade_id);
    }

    if (subject_id) {
      query += ` AND m.subject_id = $${paramIndex++}`;
      params.push(subject_id);
    }

    if (category_id) {
      query += ` AND m.category_id = $${paramIndex++}`;
      params.push(category_id);
    }

    if (term) {
      query += ` AND m.term = $${paramIndex++}`;
      params.push(term);
    }

    if (academic_year) {
      query += ` AND m.academic_year = $${paramIndex++}`;
      params.push(academic_year);
    }

    if (search) {
      query += ` AND (m.title ILIKE $${paramIndex} OR m.description ILIKE $${paramIndex})`;
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    // Safe sorting check
    const validSortFields = {
      created_at: "m.created_at",
      download_count: "m.download_count",
      view_count: "m.view_count",
      title: "m.title",
      academic_year: "m.academic_year",
    };
    const sortField = validSortFields[sortBy] || "m.created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    query += ` ORDER BY ${sortField} ${order}`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return rows.map((row) => new Material(row));
  },

  async findById(id, userId = 0) {
    const query = `
      SELECT 
        m.*,
        s.name AS subject_name,
        g.grade_id,
        g.name AS grade_name,
        c.name AS category_name,
        EXISTS (SELECT 1 FROM bookmarks b WHERE b.material_id = m.material_id AND b.user_id = $2) AS is_bookmarked
      FROM materials m
      JOIN subjects s ON m.subject_id = s.subject_id
      JOIN grades g ON s.grade_id = g.grade_id
      JOIN material_categories c ON m.category_id = c.category_id
      WHERE m.material_id = $1
    `;
    const { rows } = await pool.query(query, [id, userId]);
    return rows[0] ? new Material(rows[0]) : null;
  },

  async create({
    subject_id,
    category_id,
    title,
    description,
    academic_year,
    term,
    file_url,
    public_id,
    thumbnail_url,
  }) {
    const query = `
      INSERT INTO materials (
        subject_id,
        category_id,
        title,
        description,
        academic_year,
        term,
        file_url,
        public_id,
        thumbnail_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [
      subject_id,
      category_id,
      title.trim(),
      description || null,
      academic_year || null,
      term || null,
      file_url,
      public_id || null,
      thumbnail_url || null,
    ]);

    return this.findById(rows[0].material_id);
  },

  async update(id, fields) {
    const allowed = [
      "subject_id",
      "category_id",
      "title",
      "description",
      "academic_year",
      "term",
      "file_url",
      "public_id",
      "thumbnail_url",
    ];

    const updates = [];
    const params = [];
    let paramIndex = 1;

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${paramIndex++}`);
        params.push(fields[key]);
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    params.push(id);
    const query = `
      UPDATE materials
      SET ${updates.join(", ")}
      WHERE material_id = $${paramIndex}
      RETURNING *
    `;

    const { rows } = await pool.query(query, params);
    if (!rows[0]) return null;
    return this.findById(id);
  },

  async delete(id) {
    const { rows } = await pool.query(
      "DELETE FROM materials WHERE material_id = $1 RETURNING public_id, file_url",
      [id]
    );
    return rows[0] || null;
  },

  async incrementDownloadCount(id) {
    const query = `
      UPDATE materials
      SET download_count = download_count + 1
      WHERE material_id = $1
      RETURNING download_count
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] ? rows[0].download_count : null;
  },

  async incrementViewCount(id) {
    const query = `
      UPDATE materials
      SET view_count = view_count + 1
      WHERE material_id = $1
      RETURNING view_count
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0] ? rows[0].view_count : null;
  },
};
