import pool from "../config/db.js";
import { materialRepository } from "../repositories/materialRepository.js";
import { studentRepository } from "../repositories/studentRepository.js";

try {
  const { rows } = await pool.query(`
    SELECT u.user_id FROM users u
    JOIN roles r ON r.role_id = u.role_id
    WHERE r.name = 'STUDENT'
    LIMIT 1
  `);
  const materials = await materialRepository.findAll({ limit: 2 });
  let dashboard = "No student account available for dashboard verification";
  if (rows[0]) {
    const result = await studentRepository.getDashboard(rows[0].user_id);
    const bookmarks = await studentRepository.getBookmarks(rows[0].user_id);
    const studentMaterials = await materialRepository.findAll({ limit: 2, user_id: rows[0].user_id });
    dashboard = {
      bookmarks: result.bookmarks.length,
      subjectBookmarks: bookmarks.subjects.length,
      materialBookmarks: bookmarks.materials.length,
      recent: result.recent.length,
      grades: result.grades.length,
      materialBookmarkStateAvailable: studentMaterials.every((material) => typeof material.is_bookmarked === "boolean"),
    };
  }
  console.log(JSON.stringify({ materials: materials.length, dashboard }, null, 2));
} finally {
  await pool.end();
}
