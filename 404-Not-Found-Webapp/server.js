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
                s.layout_json, s.unlocked_count, s.created_at AS submission_time
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
                    unlocked_count: team.unlocked_count || 0,
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
        { src: "/Assets/Elements/free_elements/logo_demo.png", locked: false },
        { src: "/Assets/Elements/free_elements/profile_icon.png", locked: false },
        { src: "/Assets/Elements/free_elements/searchbar.png", locked: false },
    ];

    const lockedElements = [
        { src: "/Assets/Elements/locked_elements/buy_now_button.png", locked: true },
        { src: "/Assets/Elements/locked_elements/hamburger.png", locked: true },
        { src: "/Assets/Elements/locked_elements/slider.png", locked: true },
        { src: "/Assets/Elements/locked_elements/wishlist.png", locked: true },
        { src: "/Assets/Elements/locked_elements/sale.jpeg", locked: true },
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
    "/Assets/Puzzles/BurningCar.jpeg",
    "/Assets/Puzzles/Car.jpeg",
    "/Assets/Puzzles/NYTrain.jpeg",
    "/Assets/Puzzles/NightmareDrawing.jpeg",
    "/Assets/Puzzles/Paris.jpeg",
    "/Assets/Puzzles/SeaTrain.jpeg",
    "/Assets/Puzzles/StarryDisk.jpeg",
];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* The 5 locked element names — must match /elements response */
const LOCKED_ELEMENT_NAMES = [
    "buy_now_button",
    "hamburger",
    "slider",
    "wishlist",
    "sale"
];

/* =========================
   GET /quiz/:team_id
   Assigns 1 unique question per locked element.
   Uses db.serialize() to prevent race conditions with 50 concurrent users.
========================= */
app.get("/quiz/:team_id", (req, res) => {
    const teamId = parseInt(req.params.team_id);
    if (isNaN(teamId)) return res.status(400).json({ message: "Invalid team_id" });

    db.serialize(() => {
        // 1. Check if questions already assigned for this team
        db.all("SELECT * FROM team_questions WHERE team_id = ?", [teamId], (err, rows) => {
            if (err) return res.status(500).json({ message: "Database error" });

            if (rows && rows.length >= LOCKED_ELEMENT_NAMES.length) {
                // Already assigned — return them with question data
                const questions = rows.map(row => {
                    if (row.type === "theory") {
                        const q = allQuestions.find(q => q.id === row.question_id);
                        return { ...row, questionData: q || null };
                    }
                    return row;
                });
                return res.json(questions);
            }

            // Clean up incomplete assignments
            if (rows && rows.length > 0 && rows.length < LOCKED_ELEMENT_NAMES.length) {
                db.run("DELETE FROM team_questions WHERE team_id = ?", [teamId]);
            }

            // 2. First time — assign 1 question per locked element
            db.all("SELECT question_id FROM team_questions WHERE type = 'theory'", [], (err2, usedRows) => {
                if (err2) return res.status(500).json({ message: "Database error" });

                const usedIds = new Set((usedRows || []).map(r => r.question_id));

                const availEasy = easyPool.filter(q => !usedIds.has(q.id));
                const availMedium = mediumPool.filter(q => !usedIds.has(q.id));
                const availHard = hardPool.filter(q => !usedIds.has(q.id));

                const pickOne = (pool, fallback) => {
                    if (pool.length > 0) {
                        const idx = Math.floor(Math.random() * pool.length);
                        const picked = pool[idx];
                        pool.splice(idx, 1); // remove so next pick is different
                        return picked;
                    }
                    if (fallback.length > 0) return fallback[Math.floor(Math.random() * fallback.length)];
                    return null;
                };

                // Pick 3 theory questions (easy, medium, hard) — each unique
                const theoryPicks = [
                    pickOne(availEasy, easyPool),
                    pickOne(availMedium, mediumPool),
                    pickOne(availHard, hardPool)
                ];

                if (theoryPicks.some(p => !p)) {
                    return res.status(500).json({ message: "Not enough questions available" });
                }

                // Pick 2 different puzzle images
                const shuffledPuzzles = shuffle(puzzleImages);

                // Build assignment: element_name → question
                // Shuffle locked element order so assignment is randomized
                const shuffledElements = shuffle(LOCKED_ELEMENT_NAMES);
                const assignments = [
                    { element: shuffledElements[0], type: "theory", qId: theoryPicks[0].id, grid: null, img: null },
                    { element: shuffledElements[1], type: "theory", qId: theoryPicks[1].id, grid: null, img: null },
                    { element: shuffledElements[2], type: "theory", qId: theoryPicks[2].id, grid: null, img: null },
                    { element: shuffledElements[3], type: "puzzle", qId: null, grid: 3, img: shuffledPuzzles[0] },
                    { element: shuffledElements[4], type: "puzzle", qId: null, grid: 5, img: shuffledPuzzles[1] },
                ];

                const stmt = db.prepare(
                    "INSERT INTO team_questions (team_id, element_name, question_id, type, grid_size, puzzle_image) VALUES (?, ?, ?, ?, ?, ?)"
                );

                assignments.forEach(a => {
                    stmt.run(teamId, a.element, a.qId, a.type, a.grid, a.img);
                });

                stmt.finalize(() => {
                    db.all("SELECT * FROM team_questions WHERE team_id = ?", [teamId], (err3, newRows) => {
                        if (err3) return res.status(500).json({ message: "Database error" });

                        const questions = newRows.map(row => {
                            if (row.type === "theory") {
                                const q = allQuestions.find(q => q.id === row.question_id);
                                return { ...row, questionData: q || null };
                            }
                            return row;
                        });
                        return res.json(questions);
                    });
                });
            });
        });
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
    const { team_id, team_name, submission_timestamp, time_taken_seconds, quiz, canvas_elements, canvas_width, canvas_height } = req.body;

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

