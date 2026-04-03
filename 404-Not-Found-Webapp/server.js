// server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect("/Auth/login.html");
});

app.get("/team-status/:team_id", (req, res) => {
    const teamId = req.params.team_id;
    db.get(
        `SELECT id, team_name, start_time, submitted, is_blocked 
         FROM teams WHERE id = ?`,
        [teamId],
        (err, team) => {
            if (err || !team) {
                return res.status(404).json({ message: "Team not found" });
            }

            const totalTime = 20 * 60 * 1000; // 20 mins
            const now = Date.now();
            const elapsed = team.start_time ? (now - team.start_time) : 0;
            const remaining = Math.max(0, totalTime - elapsed);
            const isExpired = !team.submitted && elapsed > totalTime;

            res.json({
                id: team.id,
                submitted: team.submitted == 1,
                is_blocked: team.is_blocked == 1,
                remaining_ms: remaining,
                is_expired: isExpired
            });
        }
    );
});

app.post("/login", (req, res) => {
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

    const now = Date.now(); // milliseconds

    db.get(
        "SELECT * FROM teams WHERE team_name = ?",
        [team_name],
        (err, team) => {

            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            // 🔵 If team exists
            if (team) {

                if (team.phone !== phone) {
                    return res.status(401).json({
                        message: "Incorrect phone number"
                    });
                }

                if (!team.start_time) {
                    db.run(
                        "UPDATE teams SET start_time = ? WHERE id = ?",
                        [now, team.id]
                    );
                    team.start_time = now;
                }

                db.run(
                    "INSERT INTO login_logs (team_id, login_time) VALUES (?, ?)",
                    [team.id, now]
                );

                return res.json({
                    team_id: team.id,
                    team_name: team.team_name,
                    phone: team.phone,
                    start_time: team.start_time
                });
            }

            // 🟢 New team → Register
            db.run(
                "INSERT INTO teams (team_name, phone, start_time) VALUES (?, ?, ?)",
                [team_name, phone, now],
                function (insertErr) {
                    if (insertErr) {
                        return res.status(500).json({ message: "Registration failed" });
                    }

                    const newTeamId = this.lastID;

                    db.run(
                        "INSERT INTO login_logs (team_id, login_time) VALUES (?, ?)",
                        [newTeamId, now]
                    );

                    return res.json({
                        team_id: newTeamId,
                        team_name: team_name,
                        phone: phone,
                        start_time: now
                    });
                }
            );
        }
    );
});



app.get("/admin/teams", (req, res) => {
    db.all(
        `SELECT t.id, t.team_name, t.phone, t.start_time, t.submitted,
                t.cheat_count, t.is_blocked,
                s.layout_json, s.unlocked_count, s.created_at AS submission_time,
                (SELECT COUNT(*) FROM team_questions WHERE team_id = t.id AND correct = 1) AS live_unlocked
         FROM teams t
         LEFT JOIN submissions s ON t.id = s.team_id`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            const formatted = rows.map(team => {
                let submissionData = null;
                if (team.layout_json) {
                    try {
                        submissionData = JSON.parse(team.layout_json);
                    } catch (e) {
                        submissionData = { raw: team.layout_json };
                    }
                }

                return {
                    id: team.id,
                    team_name: team.team_name,
                    phone: team.phone,
                    start_time: team.start_time,
                    start_time_readable: team.start_time
                        ? new Date(team.start_time).toLocaleString()
                        : null,
                    submitted: team.submitted,
                    cheat_count: team.cheat_count,
                    is_blocked: team.is_blocked,
                    submission_time: team.submission_time,
                    submission_time_readable: team.submission_time
                        ? new Date(team.submission_time).toLocaleString()
                        : null,
                    unlocked_count: team.unlocked_count !== null ? team.unlocked_count : (team.live_unlocked || 0),
                    is_expired: !team.submitted && team.start_time && (Date.now() - team.start_time > 20 * 60 * 1000),
                    ...(submissionData || {})
                };
            });

            res.json(formatted);
        }
    );
});

app.get("/admin/submissions", (req, res) => {
    db.all(
        `SELECT s.id, s.team_id, t.team_name, t.phone, t.cheat_count, t.is_blocked,
                s.layout_json, s.unlocked_count, s.created_at
         FROM submissions s
         JOIN teams t ON s.team_id = t.id
         ORDER BY s.created_at DESC`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            const formatted = rows.map(row => {
                let parsedData = {};
                try {
                    parsedData = JSON.parse(row.layout_json);
                } catch (e) {
                    parsedData = { raw: row.layout_json };
                }

                return {
                    submission_id: row.id,
                    team_id: row.team_id,
                    team_name: row.team_name,
                    phone: row.phone,
                    cheat_count: row.cheat_count,
                    is_blocked: row.is_blocked,
                    unlocked_count: row.unlocked_count,
                    submitted_at: new Date(row.created_at).toLocaleString(),
                    ...parsedData
                };
            });

            res.json(formatted);
        }
    );
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
   QUIZ DATA
========================= */
const fs = require("fs");
const path = require("path");

const quizData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "public", "Quizzes", "quiz_ques.json"), "utf8")
);
const allQuestions = quizData.questions;

const easyPool = allQuestions.filter(q => q.level === "easy");
const mediumPool = allQuestions.filter(q => q.level === "medium");
const hardPool = allQuestions.filter(q => q.level === "hard" || q.level === "advanced");

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

// 11 fixed locked elements. If the user wants 12, they can add one to the folder.
// The logic below will dynamically handle whatever is in the locked_elements folder.
const LOCKED_ELEMENTS_DIR = path.join(__dirname, "public", "Assets", "Elements", "locked_elements");
let LOCKED_ELEMENT_NAMES = [];
try {
    LOCKED_ELEMENT_NAMES = fs.readdirSync(LOCKED_ELEMENTS_DIR)
        .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
        .map(f => f.replace(/\.(png|jpe?g|webp)$/i, ""));
} catch (e) {
    console.error("Error reading locked elements:", e);
    LOCKED_ELEMENT_NAMES = ["buy_now_button", "hamburger", "slider", "wishlist", "sale", "404_rbg", "electronics", "home_decor", "kids", "men", "women"];
}


/* =========================
   GET /quiz/:team_id
   Assigns 1 unique question per locked element.
   Uses db.serialize() to prevent race conditions with 50 concurrent users.
 ========================= */
app.get("/quiz/:team_id", (req, res) => {
    const teamId = parseInt(req.params.team_id);
    if (isNaN(teamId)) return res.status(400).json({ message: "Invalid team_id" });

    // Refresh dynamic element names in case files were added
    try {
        LOCKED_ELEMENT_NAMES = fs.readdirSync(LOCKED_ELEMENTS_DIR)
            .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
            .map(f => f.replace(/\.(png|jpe?g|webp)$/i, ""));
    } catch (e) {
        console.error("Error refreshing locked elements:", e);
    }

    db.serialize(() => {
        db.all("SELECT * FROM team_questions WHERE team_id = ?", [teamId], (err, rows) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (rows && rows.length > 0) {
                const questions = rows.map(row => {
                    if (row.type !== "puzzle") {
                        const q = allQuestions.find(q => q.id === row.question_id);
                        return { ...row, questionData: q || null };
                    }
                    return row;
                });
                return res.json(questions);
            }

            db.all("SELECT question_id, type FROM team_questions", [], (err2, usedRows) => {
                if (err2) return res.status(500).json({ message: "Database error" });

                const usedIds = new Set((usedRows || []).map(r => r.question_id));

                const pickPool = (pool, count, used) => {
                    const avail = pool.filter(q => !used.has(q.id));
                    const picked = shuffle(avail.length >= count ? avail : pool).slice(0, count);
                    return picked;
                };

                const totalNeeded = LOCKED_ELEMENT_NAMES.length;
                
                // Distribution for 12 items: 6 ui, 3 puzzle, 2 cond, 1 apt
                // Adjust dynamically if less/more than 12
                let numPuzzles = 3;
                let numCond = Math.min(2, Math.max(0, totalNeeded - 9)); // try to keep at least 2 if possible
                let numApt = Math.min(1, Math.max(0, totalNeeded - (6 + 3 + 2))); 
                
                // For 11 elements: 5 UI/UX, 3 Puzzle, 2 Cond, 1 Apt
                let numUI = totalNeeded - numPuzzles - numCond - numApt;
                if (totalNeeded === 11) {
                    numUI = 5; numPuzzles = 3; numCond = 2; numApt = 1;
                } else if (totalNeeded === 12) {
                    numUI = 6; numPuzzles = 3; numCond = 2; numApt = 1;
                } else {
                    // Fallback distribution
                    numPuzzles = Math.min(3, totalNeeded);
                    numCond = Math.min(2, totalNeeded - numPuzzles);
                    numApt = Math.min(1, totalNeeded - numPuzzles - numCond);
                    numUI = Math.max(0, totalNeeded - numPuzzles - numCond - numApt);
                }

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
                        element: shuffledElements[i],
                        type: theoryPicks[i].type,
                        qId: theoryPicks[i].id,
                        grid: null,
                        img: null
                    });
                }

                // Assign puzzles
                const puzzleGrids = [3, 4, 5]; // Rotate grids
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

                const stmt = db.prepare(
                    "INSERT INTO team_questions (team_id, element_name, question_id, type, grid_size, puzzle_image) VALUES (?, ?, ?, ?, ?, ?)"
                );
                assignments.forEach(a => {
                    stmt.run(teamId, a.element, a.qId, a.type, a.grid, a.img);
                });
                stmt.finalize(() => {
                    db.all("SELECT * FROM team_questions WHERE team_id = ?", [teamId], (err3, newRows) => {
                        const final = newRows.map(row => {
                            if (row.type !== "puzzle") {
                                const q = allQuestions.find(q => q.id === row.question_id);
                                return { ...row, questionData: q || null };
                            }
                            return row;
                        });
                        res.json(final);
                    });
                });
            });
        });
    });
});

/* =========================
   PERSISTENCE: DRAFTS
========================= */
app.post("/draft", (req, res) => {
    const { team_id, layout_json } = req.body;
    if (!team_id || !layout_json) {
        return res.status(400).json({ message: "Missing draft data" });
    }

    db.run(
        "INSERT INTO drafts (team_id, layout_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(team_id) DO UPDATE SET layout_json = excluded.layout_json, updated_at = CURRENT_TIMESTAMP",
        [team_id, layout_json],
        (err) => {
            if (err) {
                console.error("Draft save error:", err);
                return res.status(500).json({ message: "Failed to save draft" });
            }
            res.json({ message: "Draft saved" });
        }
    );
});

app.get("/draft/:team_id", (req, res) => {
    const teamId = req.params.team_id;
    db.get("SELECT layout_json FROM drafts WHERE team_id = ?", [teamId], (err, row) => {
        if (err || !row) {
            return res.json({ layout_json: null });
        }
        res.json(row);
    });
});


/* =========================
   POST /quiz/answer
========================= */
app.post("/quiz/answer", (req, res) => {
    const { team_id, question_row_id, is_correct } = req.body;
    if (!team_id || !question_row_id) {
        return res.status(400).json({ message: "Missing data" });
    }

    // Idempotency: check if already answered
    db.get(
        "SELECT answered, correct FROM team_questions WHERE id = ? AND team_id = ?",
        [question_row_id, team_id],
        (err, row) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (!row) return res.status(404).json({ message: "Question not found" });

            if (row.answered) {
                // Already answered — return cached result
                return res.json({ message: "Answer already recorded", already_answered: true, correct: row.correct });
            }

            db.run(
                "UPDATE team_questions SET answered = 1, correct = ? WHERE id = ? AND team_id = ?",
                [is_correct ? 1 : 0, question_row_id, team_id],
                function (updateErr) {
                    if (updateErr) return res.status(500).json({ message: "Database error" });
                    res.json({ message: "Answer recorded" });
                }
            );
        }
    );
});

/* =========================
   POST /cheat
========================= */
app.post("/cheat", (req, res) => {
    const { team_id } = req.body;
    if (!team_id) return res.status(400).json({ message: "Missing team_id" });

    db.get("SELECT cheat_count, is_blocked FROM teams WHERE id = ?", [team_id], (err, team) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (!team) return res.status(404).json({ message: "Team not found" });

        if (team.is_blocked) {
            return res.json({ cheat_count: team.cheat_count, is_blocked: true });
        }

        const newCount = (team.cheat_count || 0) + 1;
        const blocked = newCount >= 3 ? 1 : 0;

        db.run(
            "UPDATE teams SET cheat_count = ?, is_blocked = ? WHERE id = ?",
            [newCount, blocked, team_id],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ message: "Update failed" });
                res.json({ cheat_count: newCount, is_blocked: blocked === 1 });
            }
        );
    });
});


app.post("/submit", (req, res) => {
    const { team_id, team_name, submission_timestamp, time_taken_seconds, quiz, canvas_elements, canvas_width, canvas_height, canvas_bg_color } = req.body;

    if (!team_id || !quiz || !canvas_elements) {
        return res.status(400).json({ message: "Missing submission data" });
    }

    const now = submission_timestamp || Date.now();

    // Serialize to prevent double-submission race with 50 concurrent users
    db.serialize(() => {
        db.get("SELECT submitted, cheat_count, is_blocked, start_time FROM teams WHERE id = ?", [team_id], (err, team) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (!team) return res.status(404).json({ message: "Team not found" });
            if (team.submitted) return res.status(400).json({ message: "Already submitted" });

            const cheated = team.is_blocked ? true : false;

            const submissionData = {
                team_id,
                team_name: team_name || null,
                submission_timestamp: now,
                submitted: true,
                time_taken_seconds: time_taken_seconds || Math.floor((now - team.start_time) / 1000),
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

            db.run(
                "INSERT INTO submissions (team_id, layout_json, unlocked_count, created_at) VALUES (?, ?, ?, ?)",
                [team_id, layout_json, quiz.total_correct || 0, now],
                function (insertErr) {
                    if (insertErr) {
                        return res.status(500).json({ message: "Submission failed" });
                    }

                    db.run("UPDATE teams SET submitted = 1 WHERE id = ?", [team_id], (updateErr) => {
                        if (updateErr) {
                            return res.status(500).json({ message: "Failed to update team status" });
                        }
                        res.json({ message: "Submission successful", cheated, data: submissionData });
                    });
                }
            );
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

