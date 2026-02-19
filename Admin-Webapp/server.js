// Admin-Webapp/server.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html, styles.css, etc.

// ====== DATABASE ======
// Connect to the SAME database used by 404-Not-Found-Webapp
const DB_PATH = path.join(__dirname, "..", "404-Not-Found-Webapp", "db.sqlite");
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("❌ Could not connect to database:", err.message);
        console.error("   Make sure 404-Not-Found-Webapp/db.sqlite exists.");
    } else {
        console.log("✅ Connected to 404-Not-Found-Webapp database (read-only).");
    }
});

// ====== HELPER: promisify db methods ======
function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// ==========================================
//   GET /admin/api/teams
//   Returns all teams with unlocked_count,
//   has_submission flag, and time_taken
// ==========================================
app.get("/admin/api/teams", async (req, res) => {
    try {
        const teams = await dbAll(`
            SELECT
                t.id,
                t.team_name,
                t.phone,
                t.start_time,
                t.submitted,
                t.cheat_count,
                t.is_blocked,
                t.created_at,
                COALESCE(u.unlocked_count, 0) AS unlocked_count,
                CASE
                    WHEN s.id IS NOT NULL AND t.start_time IS NOT NULL
                    THEN COALESCE(s.time_taken, s.created_at - t.start_time)
                    ELSE NULL
                END AS time_taken,
                CASE WHEN s.id IS NOT NULL THEN 1 ELSE 0 END AS has_submission
            FROM teams t
            LEFT JOIN (
                SELECT team_id, COUNT(*) AS unlocked_count
                FROM unlocks
                GROUP BY team_id
            ) u ON u.team_id = t.id
            LEFT JOIN submissions s ON s.team_id = t.id
            ORDER BY t.id ASC
        `);

        res.json(teams);
    } catch (e) {
        console.error("Error fetching teams:", e);
        res.status(500).json({ message: "Database error" });
    }
});

// ==========================================
//   GET /admin/api/stats
//   Returns total_teams, submitted, pending
// ==========================================
app.get("/admin/api/stats", async (req, res) => {
    try {
        const total = await dbGet("SELECT COUNT(*) AS count FROM teams");
        const submitted = await dbGet("SELECT COUNT(*) AS count FROM teams WHERE submitted = 1");

        const totalTeams = total ? total.count : 0;
        const submittedCount = submitted ? submitted.count : 0;

        res.json({
            total_teams: totalTeams,
            submitted: submittedCount,
            pending: totalTeams - submittedCount,
        });
    } catch (e) {
        console.error("Error fetching stats:", e);
        res.status(500).json({ message: "Database error" });
    }
});

// ==========================================
//   GET /admin/api/teams/:id
//   Returns detailed info for a single team:
//   team data, unlocks, submission, login logs
// ==========================================
app.get("/admin/api/teams/:id", async (req, res) => {
    const teamId = parseInt(req.params.id);

    try {
        // 1. Get team info
        const team = await dbGet("SELECT * FROM teams WHERE id = ?", [teamId]);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // 2. Get unlocked element names
        const unlockRows = await dbAll(
            "SELECT element_name FROM unlocks WHERE team_id = ?",
            [teamId]
        );
        const unlocks = unlockRows.map((r) => r.element_name);

        // 3. Get submission (if any)
        const submission = await dbGet(
            "SELECT * FROM submissions WHERE team_id = ?",
            [teamId]
        );

        // 4. Get login logs
        const loginLogs = await dbAll(
            "SELECT * FROM login_logs WHERE team_id = ? ORDER BY login_time DESC",
            [teamId]
        );

        res.json({
            id: team.id,
            team_name: team.team_name,
            phone: team.phone,
            start_time: team.start_time,
            submitted: team.submitted,
            cheat_count: team.cheat_count,
            is_blocked: team.is_blocked,
            created_at: team.created_at,
            unlocks,
            submission: submission || null,
            login_logs: loginLogs,
        });
    } catch (e) {
        console.error("Error fetching team detail:", e);
        res.status(500).json({ message: "Database error" });
    }
});

// ====== DEFAULT ROUTE ======
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ====== START SERVER ======
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Admin Dashboard running on http://localhost:${PORT}`);
});
