import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(here, "../../migrations");

try {
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    await pool.query(await fs.readFile(path.join(migrationsDir, file), "utf8"));
    console.log(`Applied ${file}`);
  }
} finally {
  await pool.end();
}
