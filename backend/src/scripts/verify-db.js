import pool from "../config/db.js";
import {
  roleRepository,
  categoryRepository,
  gradeRepository,
  subjectRepository,
  materialRepository,
  userRepository,
  bookmarkRepository,
  notificationRepository,
  announcementRepository,
} from "../repositories/index.js";

async function verify() {
  console.log("=== Verifying Entities & Repositories ===");

  // 1. Roles
  const roles = await roleRepository.findAll();
  console.log(`✓ Roles (${roles.length}):`, roles.map((r) => r.name).join(", "));
  if (roles.length < 2) throw new Error("Roles table missing seed data");

  // 2. Categories
  const categories = await categoryRepository.findAll();
  console.log(`✓ Material Categories (${categories.length}):`, categories.map((c) => c.name).join(", "));
  if (categories.length < 8) throw new Error("Categories missing seed data");

  // 3. Grades & Subjects
  const grades = await gradeRepository.findAll();
  console.log(`✓ Grades count: ${grades.length}`);

  const subjects = await subjectRepository.findAll();
  console.log(`✓ Subjects count: ${subjects.length}`);

  // 4. Materials
  const materials = await materialRepository.findAll();
  console.log(`✓ Materials count: ${materials.length}`);

  // 5. Users
  const users = await userRepository.findAll();
  console.log(`✓ Users count: ${users.length}`);

  // 6. Announcements
  const announcements = await announcementRepository.findAll();
  console.log(`✓ Announcements count: ${announcements.length}`);

  console.log("\n All Entities & Repositories initialized and queried successfully!");
}

verify()
  .catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
