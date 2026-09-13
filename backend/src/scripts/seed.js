import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { roleRepository } from "../repositories/roleRepository.js";
import { userRepository } from "../repositories/userRepository.js";

async function seedInitialAdmin() {
  console.log("=== EduVault Seeder: Initial Admin Setup ===");

  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@eduvault.lk";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
    const adminName = process.env.ADMIN_NAME || "EduVault Administrator";

    // 1. Check if Admin already exists
    const existingUser = await userRepository.findByEmail(adminEmail);
    if (existingUser) {
      console.log(`ℹ Initial Admin account already exists (${existingUser.email}). Skipping creation.`);
      return;
    }

    // 2. Fetch ADMIN role
    const adminRole = await roleRepository.findByName("ADMIN");
    if (!adminRole) {
      throw new Error("ADMIN role not found in roles table! Please run SQL schema setup first.");
    }

    // 3. Hash admin password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // 4. Create Admin user
    const admin = await userRepository.create({
      role_id: adminRole.role_id,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
    });

    console.log("✓ Initial Admin created successfully!");
    console.log(`  - User ID: ${admin.user_id}`);
    console.log(`  - Name:    ${admin.name}`);
    console.log(`  - Email:   ${admin.email}`);
    console.log(`  - Role:    ${adminRole.name}`);
    console.log(`  - Default password used: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Error seeding initial Admin:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedInitialAdmin();
