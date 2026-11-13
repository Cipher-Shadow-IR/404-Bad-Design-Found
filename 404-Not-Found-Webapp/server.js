// server.js
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });
dotenv.config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const crypto = require("crypto");
const { sql, initDB } = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@techxtreme.gu";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "404baddesignfound2026";

// In-memory or deterministic auth token store
const adminSessions = new Set();

function generateAdminToken() {
    return crypto.randomBytes(32).toString("hex");
}

function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Admin authorization required" });
    }
    const token = authHeader.split(" ")[1];
    if (!adminSessions.has(token)) {
        return res.status(403).json({ message: "Invalid or expired admin token" });
    }
    next();
}

// Admin login endpoint
app.post("/admin/login", (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = generateAdminToken();
        adminSessions.add(token);
        return res.json({ success: true, token, email: ADMIN_EMAIL });
    }
    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
});

// Admin verify session
app.get("/admin/verify", verifyAdmin, (req, res) => {
    res.json({ valid: true });
});

// Ensure Neon schema is ready before handling database requests
app.use(async (req, res, next) => {
    // Only intercept API calls, let static assets through quickly
    if (req.path.startsWith("/Assets") || req.path.endsWith(".css") || req.path.endsWith(".js") || req.path.endsWith(".png") || req.path.endsWith(".jpg")) {
        return next();
    }
    try {
        await initDB();
    } catch (e) {
        console.error("DB init middleware error:", e);
    }
    next();
});

// Root redirect
app.get("/", (req, res) => {
    res.redirect("/Auth/login.html");
});

// Team status check
app.get("/team-status/:team_id", async (req, res) => {
    const teamId = parseInt(req.params.team_id, 10);
    if (isNaN(teamId)) return res.status(400).json({ message: "Invalid team_id" });

    try {
        const rows = await sql`
            SELECT id, team_name, start_time, submitted, is_blocked 
            FROM teams WHERE id = ${teamId} LIMIT 1
        `;

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "Team not found" });
        }

        const team = rows[0];
        const totalTime = 20 * 60 * 1000; // 20 mins
        const now = Date.now();
        const startTime = team.start_time ? Number(team.start_time) : 0;
        const elapsed = startTime ? (now - startTime) : 0;
        const remaining = Math.max(0, totalTime - elapsed);
        const isExpired = !team.submitted && elapsed > totalTime;

        res.json({
            id: team.id,
            submitted: team.submitted == 1,
            is_blocked: team.is_blocked == 1,
            remaining_ms: remaining,
            is_expired: isExpired
        });
    } catch (err) {
        console.error("team-status error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Team Login / Register
app.post("/login", async (req, res) => {
    const { team_name, phone } = req.body;

    if (!team_name || !phone) {
        return res.status(400).json({ message: "All fields required" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            message: "Phone number must be 10 digits"
        });
    }

    const now = Date.now();

    try {
        const existingTeams = await sql`
            SELECT * FROM teams WHERE team_name = ${team_name} LIMIT 1
        `;

        if (existingTeams.length > 0) {
            const team = existingTeams[0];

            if (team.phone !== phone) {
                return res.status(401).json({
                    message: "Incorrect phone number"
                });
            }

            let finalStartTime = team.start_time ? Number(team.start_time) : now;

            if (!team.start_time) {
                await sql`
                    UPDATE teams SET start_time = ${now} WHERE id = ${team.id}
                `;
            }

            await sql`
                INSERT INTO login_logs (team_id, login_time) VALUES (${team.id}, ${now})
            `;

            return res.json({
                team_id: team.id,
                team_name: team.team_name,
                phone: team.phone,
                start_time: finalStartTime
            });
        }

        // New team -> Register
        const inserted = await sql`
            INSERT INTO teams (team_name, phone, start_time) 
            VALUES (${team_name}, ${phone}, ${now})
            RETURNING id, team_name, phone, start_time
        `;

        const newTeam = inserted[0];

        await sql`
            INSERT INTO login_logs (team_id, login_time) VALUES (${newTeam.id}, ${now})
        `;

        return res.json({
            team_id: newTeam.id,
            team_name: newTeam.team_name,
            phone: newTeam.phone,
            start_time: Number(newTeam.start_time)
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Registration or database failed" });
    }
});

// Admin: Get all teams
app.get("/admin/teams", verifyAdmin, async (req, res) => {
    try {
        const rows = await sql`
            SELECT t.id, t.team_name, t.phone, t.start_time, t.submitted,
                   t.cheat_count, t.is_blocked,
                   s.layout_json, s.unlocked_count, s.created_at AS submission_time,
                   (SELECT COUNT(*) FROM team_questions WHERE team_id = t.id AND correct = 1) AS live_unlocked
            FROM teams t
            LEFT JOIN submissions s ON t.id = s.team_id
            ORDER BY t.id ASC
        `;

        const formatted = rows.map(team => {
            let submissionData = null;
            if (team.layout_json) {
                try {
                    submissionData = typeof team.layout_json === "string" 
                        ? JSON.parse(team.layout_json) 
                        : team.layout_json;
                } catch (e) {
                    submissionData = { raw: team.layout_json };
                }
            }

            const startTime = team.start_time ? Number(team.start_time) : null;
            const subTime = team.submission_time ? Number(team.submission_time) : null;

            return {
                id: team.id,
                team_name: team.team_name,
                phone: team.phone,
                start_time: startTime,
                start_time_readable: startTime ? new Date(startTime).toLocaleString() : null,
                cheat_count: team.cheat_count,
                is_blocked: team.is_blocked,
                submission_time: subTime,
                submission_time_readable: subTime ? new Date(subTime).toLocaleString() : null,
                unlocked_count: team.unlocked_count !== null && team.unlocked_count !== undefined 
                    ? Number(team.unlocked_count) 
                    : Number(team.live_unlocked || 0),
                is_expired: !team.submitted && startTime && (Date.now() - startTime > 20 * 60 * 1000),
                ...(submissionData || {}),
                submitted: team.submitted == 1 || (submissionData && submissionData.submitted === true)
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error("admin/teams error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Admin: Get all submissions
app.get("/admin/submissions", verifyAdmin, async (req, res) => {
    try {
        const rows = await sql`
            SELECT s.id, s.team_id, t.team_name, t.phone, t.cheat_count, t.is_blocked,
                   s.layout_json, s.unlocked_count, s.created_at
            FROM submissions s
            JOIN teams t ON s.team_id = t.id
            ORDER BY s.created_at DESC
        `;

        const formatted = rows.map(row => {
            let parsedData = {};
            try {
                parsedData = typeof row.layout_json === "string" ? JSON.parse(row.layout_json) : row.layout_json;
            } catch (e) {
                parsedData = { raw: row.layout_json };
            }

            const subAt = row.created_at ? new Date(Number(row.created_at)).toLocaleString() : null;

            return {
                submission_id: row.id,
                team_id: row.team_id,
                team_name: row.team_name,
                phone: row.phone,
                cheat_count: row.cheat_count,
                is_blocked: row.is_blocked,
                unlocked_count: Number(row.unlocked_count || 0),
                submitted_at: subAt,
                ...parsedData
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error("admin/submissions error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

/* Helper: derive element name from filename */
function elementNameFromSrc(src) {
    return src.split("/").pop().replace(/\.(png|jpe?g|gif|svg|webp)$/i, "");
}

app.get("/elements", (req, res) => {
    const freeElements = [
        { src: "/Assets/Elements/free_elements/404BDNF_logo.png", locked: false },
        { src: "/Assets/Elements/free_elements/profile_icon.png", locked: false },
        { src: "/Assets/Elements/free_elements/searchbar.png", locked: false },
    ];

    const lockedElements = [
        { src: "/Assets/Elements/locked_elements/bell_icon.png", locked: true },
        { src: "/Assets/Elements/locked_elements/cart.png", locked: true },
        { src: "/Assets/Elements/locked_elements/hamburger.png", locked: true },
        { src: "/Assets/Elements/locked_elements/slider.png", locked: true },
        { src: "/Assets/Elements/locked_elements/wishlist.png", locked: true },
        { src: "/Assets/Elements/locked_elements/sale.png", locked: true },
        { src: "/Assets/Elements/locked_elements/404_rbg.png", locked: true },
        { src: "/Assets/Elements/locked_elements/electronics.png", locked: true },
        { src: "/Assets/Elements/locked_elements/home_decor.png", locked: true },
        { src: "/Assets/Elements/locked_elements/kids.png", locked: true },
        { src: "/Assets/Elements/locked_elements/men.png", locked: true },
        { src: "/Assets/Elements/locked_elements/women.png", locked: true },
    ];

    const all = [...freeElements, ...lockedElements].map(el => ({
        ...el,
        name: elementNameFromSrc(el.src)
    }));

    res.json(all);
});

/* =========================
   QUIZ DATA & LOGIC
========================= */
const quizFilePath = path.join(__dirname, "public", "Quizzes", "quiz_ques.json");
let allQuestions = [];
try {
    const quizData = JSON.parse(fs.readFileSync(quizFilePath, "utf8"));
    allQuestions = quizData.questions || [];
} catch (e) {
    console.error("Could not load quiz questions JSON:", e);
}

const puzzleImages = [
    "/Assets/Puzzles/NYTrain.jpeg",
    "/Assets/Puzzles/NightmareDrawing.jpeg",
    "/Assets/Puzzles/Paris.jpeg",
    "/Assets/Puzzles/SeaTrain.jpeg",
    "/Assets/Puzzles/StarryDisk.jpeg",
];

const uiPool = allQuestions.filter(q => q.type === "ui_ux");
const condPool = allQuestions.filter(q => q.type === "conditional");
const aptPool = allQuestions.filter(q => q.type === "aptitude");

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const LOCKED_ELEMENTS_DIR = path.join(__dirname, "public", "Assets", "Elements", "locked_elements");
let LOCKED_ELEMENT_NAMES = [];
try {
    LOCKED_ELEMENT_NAMES = fs.readdirSync(LOCKED_ELEMENTS_DIR)
        .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
        .map(f => f.replace(/\.(png|jpe?g|webp)$/i, ""));
} catch (e) {
    LOCKED_ELEMENT_NAMES = ["404_rbg", "bell_icon", "cart", "electronics", "hamburger", "home_decor", "kids", "men", "sale", "slider", "wishlist", "women"];
}

app.get("/quiz/:team_id", async (req, res) => {
    const teamId = parseInt(req.params.team_id, 10);
    if (isNaN(teamId)) return res.status(400).json({ message: "Invalid team_id" });

    try {
        const existingRows = await sql`
            SELECT * FROM team_questions WHERE team_id = ${teamId}
        `;

        if (existingRows && existingRows.length > 0) {
            const questions = existingRows.map(row => {
                if (row.type !== "puzzle") {
                    const q = allQuestions.find(item => item.id === row.question_id);
                    return { ...row, questionData: q || null };
                }
                return row;
            });
            return res.json(questions);
        }

        // New assignment needed
        const usedRows = await sql`SELECT question_id, type FROM team_questions`;
        const usedIds = new Set((usedRows || []).map(r => r.question_id));

        const pickPool = (pool, count, used) => {
            const avail = pool.filter(q => !used.has(q.id));
            const picked = shuffle(avail.length >= count ? avail : pool).slice(0, count);
            return picked;
        };

        const totalNeeded = LOCKED_ELEMENT_NAMES.length || 12;

        let numPuzzles = 3;
        let numCond = 2;
        let numApt = 1;
        let numUI = Math.max(0, totalNeeded - numPuzzles - numCond - numApt);

        const uiPicks = pickPool(uiPool, numUI, usedIds);
        const condPicks = pickPool(condPool, numCond, usedIds);
        const aptPicks = pickPool(aptPool, numApt, usedIds);

        const theoryPicks = [
            ...uiPicks.map(p => ({ ...p, type: "ui_ux" })),
            ...condPicks.map(p => ({ ...p, type: "conditional" })),
            ...aptPicks.map(p => ({ ...p, type: "aptitude" }))
        ];

        const shuffledPuzzles = shuffle(puzzleImages);
        const shuffledElements = shuffle(LOCKED_ELEMENT_NAMES);
        const assignments = [];

        // Assign theory questions
        for (let i = 0; i < theoryPicks.length; i++) {
            assignments.push({
                element: shuffledElements[i] || `element_${i}`,
                type: theoryPicks[i].type,
                qId: theoryPicks[i].id,
                grid: null,
                img: null
            });
        }

        // Assign puzzles
        const puzzleGrids = [3, 4, 5];
        for (let i = 0; i < numPuzzles; i++) {
            const elIdx = theoryPicks.length + i;
            if (elIdx < shuffledElements.length) {
                assignments.push({
                    element: shuffledElements[elIdx],
                    type: "puzzle",
                    qId: null,
                    grid: puzzleGrids[i % 3], 
                    img: shuffledPuzzles[i % shuffledPuzzles.length]
                });
            }
        }

        // Insert into Neon Postgres
        for (const a of assignments) {
            await sql`
                INSERT INTO team_questions (team_id, element_name, question_id, type, grid_size, puzzle_image)
                VALUES (${teamId}, ${a.element}, ${a.qId}, ${a.type}, ${a.grid}, ${a.img})
            `;
        }

        const newRows = await sql`SELECT * FROM team_questions WHERE team_id = ${teamId}`;
        const final = newRows.map(row => {
            if (row.type !== "puzzle") {
                const q = allQuestions.find(item => item.id === row.question_id);
                return { ...row, questionData: q || null };
            }
            return row;
        });

        res.json(final);
    } catch (err) {
        console.error("quiz assignment error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

/* =========================
   PERSISTENCE: DRAFTS
========================= */
app.post("/draft", async (req, res) => {
    const { team_id, layout_json } = req.body;
    if (!team_id || !layout_json) {
        return res.status(400).json({ message: "Missing draft data" });
    }

    try {
        const layoutStr = typeof layout_json === "string" ? layout_json : JSON.stringify(layout_json);
        await sql`
            INSERT INTO drafts (team_id, layout_json, updated_at) 
            VALUES (${team_id}, ${layoutStr}, CURRENT_TIMESTAMP)
            ON CONFLICT (team_id) 
            DO UPDATE SET layout_json = EXCLUDED.layout_json, updated_at = CURRENT_TIMESTAMP
        `;
        res.json({ message: "Draft saved" });
    } catch (err) {
        console.error("Draft save error:", err);
        res.status(500).json({ message: "Failed to save draft" });
    }
});

app.get("/draft/:team_id", async (req, res) => {
    const teamId = parseInt(req.params.team_id, 10);
    if (isNaN(teamId)) return res.json({ layout_json: null });

    try {
        const rows = await sql`
            SELECT layout_json FROM drafts WHERE team_id = ${teamId} LIMIT 1
        `;
        if (!rows || rows.length === 0) {
            return res.json({ layout_json: null });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("draft fetch error:", err);
        res.json({ layout_json: null });
    }
});

/* =========================
   POST /quiz/answer
========================= */
app.post("/quiz/answer", async (req, res) => {
    const { team_id, question_row_id, is_correct } = req.body;
    if (!team_id || !question_row_id) {
        return res.status(400).json({ message: "Missing data" });
    }

    try {
        const rows = await sql`
            SELECT answered, correct FROM team_questions 
            WHERE id = ${question_row_id} AND team_id = ${team_id} LIMIT 1
        `;

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        const row = rows[0];
        if (row.answered == 1) {
            return res.json({ message: "Answer already recorded", already_answered: true, correct: row.correct });
        }

        const isCorrectVal = is_correct ? 1 : 0;
        await sql`
            UPDATE team_questions 
            SET answered = 1, correct = ${isCorrectVal} 
            WHERE id = ${question_row_id} AND team_id = ${team_id}
        `;

        res.json({ message: "Answer recorded" });
    } catch (err) {
        console.error("quiz/answer error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

/* =========================
   POST /cheat
========================= */
app.post("/cheat", async (req, res) => {
    const { team_id } = req.body;
    if (!team_id) return res.status(400).json({ message: "Missing team_id" });

    try {
        const rows = await sql`
            SELECT cheat_count, is_blocked FROM teams WHERE id = ${team_id} LIMIT 1
        `;

        if (!rows || rows.length === 0) return res.status(404).json({ message: "Team not found" });
        const team = rows[0];

        if (team.is_blocked == 1) {
            return res.json({ cheat_count: team.cheat_count, is_blocked: true });
        }

        const newCount = (team.cheat_count || 0) + 1;
        const blocked = newCount >= 3 ? 1 : 0;

        await sql`
            UPDATE teams 
            SET cheat_count = ${newCount}, is_blocked = ${blocked} 
            WHERE id = ${team_id}
        `;

        res.json({ cheat_count: newCount, is_blocked: blocked === 1 });
    } catch (err) {
        console.error("cheat error:", err);
        res.status(500).json({ message: "Database update failed" });
    }
});

/* =========================
   POST /submit
========================= */
app.post("/submit", async (req, res) => {
    const { 
        team_id, 
        team_name, 
        submission_timestamp, 
        time_taken_seconds, 
        quiz, 
        canvas_elements, 
        canvas_width, 
        canvas_height, 
        canvas_bg_color 
    } = req.body;

    if (!team_id || !quiz || !canvas_elements) {
        return res.status(400).json({ message: "Missing submission data" });
    }

    const now = submission_timestamp || Date.now();

    try {
        const teamRows = await sql`
            SELECT submitted, cheat_count, is_blocked, start_time 
            FROM teams WHERE id = ${team_id} LIMIT 1
        `;

        if (!teamRows || teamRows.length === 0) return res.status(404).json({ message: "Team not found" });
        const team = teamRows[0];

        if (team.submitted == 1) {
            return res.status(400).json({ message: "Already submitted" });
        }

        const cheated = team.is_blocked == 1;
        const startTime = team.start_time ? Number(team.start_time) : now;
        const timeTaken = time_taken_seconds || Math.floor((now - startTime) / 1000);

        const submissionData = {
            team_id,
            team_name: team_name || null,
            submission_timestamp: now,
            submitted: true,
            time_taken_seconds: timeTaken,
            quiz: {
                total_attempted: quiz.total_attempted || 0,
                total_correct: quiz.total_correct || 0
            },
            cheated,
            cheat_count: team.cheat_count || 0,
            canvas_width: canvas_width || null,
            canvas_height: canvas_height || null,
            canvas_bg_color: canvas_bg_color || "#ffffff",
            canvas_elements: canvas_elements || []
        };

        const layout_json = JSON.stringify(submissionData);
        const unlockedCount = quiz.total_correct || 0;

        await sql`
            INSERT INTO submissions (team_id, layout_json, unlocked_count, created_at)
            VALUES (${team_id}, ${layout_json}, ${unlockedCount}, ${now})
            ON CONFLICT (team_id)
            DO UPDATE SET layout_json = EXCLUDED.layout_json, unlocked_count = EXCLUDED.unlocked_count, created_at = EXCLUDED.created_at
        `;

        await sql`
            UPDATE teams SET submitted = 1 WHERE id = ${team_id}
        `;

        res.json({ message: "Submission successful", cheated, data: submissionData });
    } catch (err) {
        console.error("Submit error:", err);
        res.status(500).json({ message: "Submission failed" });
    }
});

// Admin stats endpoint directly on this API (simplifies admin architecture)
app.get("/admin/stats", verifyAdmin, async (req, res) => {
    try {
        const teams = await sql`SELECT submitted, is_blocked, start_time FROM teams`;
        const now = Date.now();
        const LIMIT = 20 * 60 * 1000;

        let submittedCount = 0;
        let dqCount = 0;
        let pendingCount = 0;

        teams.forEach(t => {
            const isSubmitted = t.submitted == 1;
            const isBlocked = t.is_blocked == 1;
            const startTime = t.start_time ? Number(t.start_time) : null;
            const isExpired = startTime && (now - startTime > LIMIT);

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
    } catch (err) {
        console.error("admin/stats error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Export app for Vercel Serverless Function
module.exports = app;

// If run directly (e.g. locally with node server.js)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port http://localhost:${PORT}`);
    });
}
