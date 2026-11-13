// Admin-Webapp/server.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html, styles.css, etc.

// ====== BASE URL for 404-Not-Found-Webapp ======
const GAME_API = process.env.GAME_API_URL || "http://10.1.27.206:3000";

// ==========================================
//   GET /admin/api/teams
//   Fetches all teams from 404-Not-Found-Webapp
// ==========================================
app.get("/admin/api/teams", async (req, res) => {
    try {
        const response = await fetch(`${GAME_API}/admin/teams`);
        const teams = await response.json();
        res.json(teams);
    } catch (e) {
        console.error("Error fetching teams from game server:", e);
        res.status(500).json({ message: "Could not connect to game server at " + GAME_API });
    }
});

// ==========================================
//   GET /admin/api/stats
//   Computes stats from teams data
// ==========================================
app.get("/admin/api/stats", async (req, res) => {
    try {
        const response = await fetch(`${GAME_API}/admin/teams`);
        const teams = await response.json();

        const now = Date.now();
        const LIMIT = 20 * 60 * 1000;

        let submittedCount = 0;
        let dqCount = 0;
        let pendingCount = 0;

        teams.forEach(t => {
            const isSubmitted = t.submitted == 1 || t.submitted === true;
            const isBlocked = t.is_blocked == 1 || t.is_blocked === true;
            const isExpired = t.start_time && (now - t.start_time > LIMIT);

            if (isBlocked) {
                dqCount++;
            } else if (isSubmitted || isExpired) {
                submittedCount++;
            } else {
                pendingCount++;
            }
        });

        res.json({
            total_teams: teams.length,
            submitted: submittedCount,
            pending: pendingCount,
            disqualified: dqCount
        });
    } catch (e) {
        console.error("Error fetching stats:", e);
        res.status(500).json({ message: "Could not connect to game server at " + GAME_API });
    }
});

// ==========================================
//   GET /admin/api/teams/:id
//   Fetches a single team's detail from teams list
// ==========================================
app.get("/admin/api/teams/:id", async (req, res) => {
    const teamId = parseInt(req.params.id);

    try {
        const response = await fetch(`${GAME_API}/admin/teams`);
        const teams = await response.json();

        const team = teams.find(t => t.id === teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json(team);
    } catch (e) {
        console.error("Error fetching team detail:", e);
        res.status(500).json({ message: "Could not connect to game server at " + GAME_API });
    }
});

// ==========================================
//   GET /admin/api/submissions
//   Fetches all submissions from 404-Not-Found-Webapp
// ==========================================
app.get("/admin/api/submissions", async (req, res) => {
    try {
        const response = await fetch(`${GAME_API}/admin/submissions`);
        const submissions = await response.json();
        res.json(submissions);
    } catch (e) {
        console.error("Error fetching submissions:", e);
        res.status(500).json({ message: "Could not connect to game server at " + GAME_API });
    }
});

// ====== DEFAULT ROUTE ======
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ====== START SERVER ======
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Admin Dashboard running on http://10.1.27.206:${PORT}`);
    console.log(`📡 Fetching data from game server at ${GAME_API}`);
});
