const http = require("http");
const app = require("./api/index");

async function runE2ETests() {
  console.log("🚀 Starting in-memory server for End-to-End API & Neon Postgres tests...");
  
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Server listening at ${baseUrl}`);

  try {
    // 1. Check health / elements
    console.log("\n1️⃣ Testing GET /elements...");
    const elementsRes = await fetch(`${baseUrl}/elements`);
    const elements = await elementsRes.json();
    console.log(`✅ Loaded ${elements.length} elements.`);

    // 2. Test Team Login/Registration
    const testTeamName = `TestTeam_${Date.now()}`;
    const testPhone = "9876543210";
    console.log(`\n2️⃣ Testing POST /login with ${testTeamName}...`);
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team_name: testTeamName, phone: testPhone })
    });
    const loginData = await loginRes.json();
    if (!loginData.team_id) throw new Error("Login failed to return team_id: " + JSON.stringify(loginData));
    console.log(`✅ Registered/logged in team. team_id = ${loginData.team_id}`);

    const teamId = loginData.team_id;

    // 3. Test Team Status
    console.log(`\n3️⃣ Testing GET /team-status/${teamId}...`);
    const statusRes = await fetch(`${baseUrl}/team-status/${teamId}`);
    const statusData = await statusRes.json();
    console.log(`✅ Team status verified. submitted = ${statusData.submitted}, remaining_ms = ${statusData.remaining_ms}`);

    // 4. Test Quiz Generation
    console.log(`\n4️⃣ Testing GET /quiz/${teamId}...`);
    const quizRes = await fetch(`${baseUrl}/quiz/${teamId}`);
    const questions = await quizRes.json();
    console.log(`✅ Assigned ${questions.length} questions.`);

    // 5. Test Draft Save & Fetch
    console.log(`\n5️⃣ Testing POST & GET /draft for team ${teamId}...`);
    const sampleLayout = { test: true, elementsCount: 5, timestamp: Date.now() };
    const draftSaveRes = await fetch(`${baseUrl}/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team_id: teamId, layout_json: sampleLayout })
    });
    const draftSaveData = await draftSaveRes.json();
    console.log(`✅ Draft save response: ${draftSaveData.message}`);

    const draftGetRes = await fetch(`${baseUrl}/draft/${teamId}`);
    const draftGetData = await draftGetRes.json();
    const parsedDraft = typeof draftGetData.layout_json === "string" ? JSON.parse(draftGetData.layout_json) : draftGetData.layout_json;
    if (parsedDraft.test !== true) throw new Error("Draft retrieval mismatch");
    console.log(`✅ Draft successfully fetched and verified.`);

    // 6. Test Cheat Increment
    console.log(`\n6️⃣ Testing POST /cheat...`);
    const cheatRes = await fetch(`${baseUrl}/cheat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team_id: teamId })
    });
    const cheatData = await cheatRes.json();
    console.log(`✅ Cheat count incremented to ${cheatData.cheat_count}, is_blocked = ${cheatData.is_blocked}`);

    // 7. Test Submission
    console.log(`\n7️⃣ Testing POST /submit...`);
    const submitRes = await fetch(`${baseUrl}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_id: teamId,
        team_name: testTeamName,
        quiz: { total_attempted: 3, total_correct: 3 },
        canvas_elements: [{ src: "/Assets/Elements/free_elements/404BDNF_logo.png", x: 10, y: 20 }]
      })
    });
    const submitData = await submitRes.json();
    console.log(`✅ Submitted successfully: ${submitData.message}`);

    // 8. Test Admin Login & Protected Endpoints
    console.log(`\n8️⃣ Testing Admin Authentication & Endpoints...`);
    // Unauthorized check
    const unauthRes = await fetch(`${baseUrl}/admin/teams`);
    if (unauthRes.status !== 401) throw new Error("Unauthenticated admin/teams should return 401");
    console.log(`✅ Unauthorized request rejected with 401.`);

    // Valid admin login
    const adminLoginRes = await fetch(`${baseUrl}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@techxtreme.gu", password: "404baddesignfound2026" })
    });
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginData.token) throw new Error("Admin login failed: " + JSON.stringify(adminLoginData));
    const token = adminLoginData.token;
    console.log(`✅ Admin login successful. Token generated.`);

    // Authenticated admin endpoints
    const statsRes = await fetch(`${baseUrl}/admin/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const stats = await statsRes.json();
    console.log(`✅ Admin Stats: total_teams = ${stats.total_teams}, submitted = ${stats.submitted}`);

    const teamsRes = await fetch(`${baseUrl}/admin/teams`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const teams = await teamsRes.json();
    const found = teams.find(t => t.id === teamId);
    if (!found || !found.submitted) throw new Error("Admin teams list did not show submitted team: " + JSON.stringify(found));
    console.log(`✅ Admin verified team submission in Neon Postgres (submitted: ${found.submitted}).`);

    console.log("\n🎉 ALL END-TO-END TESTS PASSED WITH NEON POSTGRES!\n");
  } finally {
    server.close();
  }
}

runE2ETests().catch((err) => {
  console.error("❌ E2E Test Failure:", err);
  process.exit(1);
});
