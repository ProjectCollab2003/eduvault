process.env.NODE_ENV = "test";
import pool from "../config/db.js";
import app from "../../server.js";

async function runTests() {
  console.log("=== Testing EduVault Backend APIs for Landing Page, Registration & Login ===");

  const server = app.listen(5099, async () => {
    const baseUrl = "http://localhost:5099";

    try {
      // Helper fetch
      const api = async (endpoint, options = {}) => {
        const res = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
        });
        const data = await res.json();
        return { status: res.status, data };
      };

      // 1. Database Health Check
      console.log("\n1. Testing GET /api/test-db...");
      const testDb = await api("/api/test-db");
      console.log(`   Status: ${testDb.status}, message: ${testDb.data.message}`);
      if (testDb.status !== 200) throw new Error("DB Health check failed");

      // 2. Platform Stats (for Landing Page Stats Bar)
      console.log("\n2. Testing GET /api/stats (Landing page stats bar)...");
      const stats = await api("/api/stats");
      console.log(`   Status: ${stats.status}, stats:`, stats.data.data);
      if (stats.status !== 200 || !stats.data.success) throw new Error("Stats endpoint failed");

      // 3. Grades (for Landing page 'Browse by Grade' & Registration 'Your grade' dropdown)
      console.log("\n3. Testing GET /api/grades (Browse by Grade & Register dropdown)...");
      const grades = await api("/api/grades");
      console.log(`   Status: ${grades.status}, grades count: ${grades.data.data.length}`);
      if (grades.status !== 200) throw new Error("Grades endpoint failed");

      // 4. Announcements (for Landing page Announcements banner)
      console.log("\n4. Testing GET /api/announcements (Announcements banner)...");
      const announcements = await api("/api/announcements");
      console.log(`   Status: ${announcements.status}, announcements count: ${announcements.data.data.length}`);
      if (announcements.status !== 200) throw new Error("Announcements endpoint failed");

      // 5. Materials & Recent (for Landing page Search & 'Recently Added')
      console.log("\n5. Testing GET /api/materials/recent (Recently Added section)...");
      const recent = await api("/api/materials/recent?limit=6");
      console.log(`   Status: ${recent.status}, recent materials: ${recent.data.data.length}`);
      if (recent.status !== 200) throw new Error("Recent materials failed");

      console.log("\n6. Testing GET /api/materials?search=math (Landing page search bar)...");
      const search = await api("/api/materials?search=math");
      console.log(`   Status: ${search.status}, search results count: ${search.data.count}`);
      if (search.status !== 200) throw new Error("Materials search failed");

      // 7. Admin Login (using seeded Admin)
      console.log("\n7. Testing POST /api/auth/login with seeded Admin...");
      const adminLogin = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "admin@eduvault.lk",
          password: "Admin@12345",
        }),
      });
      console.log(`   Status: ${adminLogin.status}, role: ${adminLogin.data.data?.user?.role_name}`);
      if (adminLogin.status !== 200 || !adminLogin.data.data.token) {
        throw new Error("Admin login failed");
      }
      const adminToken = adminLogin.data.data.token;

      // 8. Auth Me Check (using Bearer token)
      console.log("\n8. Testing GET /api/auth/me with Admin Bearer Token...");
      const adminMe = await api("/api/auth/me", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      console.log(`   Status: ${adminMe.status}, user: ${adminMe.data.data.name} (${adminMe.data.data.role_name})`);
      if (adminMe.status !== 200) throw new Error("Auth me failed");

      // 9. Student Registration (Create Account UI)
      console.log("\n9. Testing POST /api/auth/register (Create student account)...");
      const testStudentEmail = "student.demo@eduvault.lk";
      
      // Remove test user if previously existed
      await pool.query("DELETE FROM users WHERE email = $1", [testStudentEmail]);

      const registerRes = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: "Kasun Perera",
          email: testStudentEmail,
          password: "StudentPass123!",
        }),
      });
      console.log(`   Status: ${registerRes.status}, user: ${registerRes.data.data?.user?.name}, role: ${registerRes.data.data?.user?.role_name}`);
      if (registerRes.status !== 201 || !registerRes.data.data.token) {
        throw new Error("Student registration failed");
      }
      const studentToken = registerRes.data.data.token;

      // 10. Student Login (Sign In UI)
      console.log("\n10. Testing POST /api/auth/login with newly registered student...");
      const studentLogin = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: testStudentEmail,
          password: "StudentPass123!",
        }),
      });
      console.log(`   Status: ${studentLogin.status}, user: ${studentLogin.data.data?.user?.name}`);
      if (studentLogin.status !== 200) throw new Error("Student login failed");

      // 11. Invalid Credentials Check
      console.log("\n11. Testing POST /api/auth/login with incorrect password...");
      const invalidLogin = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: testStudentEmail,
          password: "WrongPassword!",
        }),
      });
      console.log(`   Status: ${invalidLogin.status} (Expected 401), message: ${invalidLogin.data.message}`);
      if (invalidLogin.status !== 401) throw new Error("Expected 401 for invalid password");

      // 12. Duplicate Registration Check
      console.log("\n12. Testing duplicate registration with same email...");
      const duplicateRes = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: "Another Kasun",
          email: testStudentEmail,
          password: "AnotherPassword123!",
        }),
      });
      console.log(`   Status: ${duplicateRes.status} (Expected 409), message: ${duplicateRes.data.message}`);
      if (duplicateRes.status !== 409) throw new Error("Expected 409 for duplicate email");

      // Clean up test student
      await pool.query("DELETE FROM users WHERE email = $1", [testStudentEmail]);

      console.log("\n========================================================");
      console.log(" ALL 12 BACKEND TESTS PASSED SUCCESSFULLY!");
      console.log("========================================================");
    } catch (err) {
      console.error("\n❌ API Test Failed:", err);
      process.exitCode = 1;
    } finally {
      server.close();
      await pool.end();
      process.exit(process.exitCode || 0);
    }
  });
}

runTests();
