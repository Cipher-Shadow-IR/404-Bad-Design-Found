const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
        throw err;
    }

    console.log("Connected to SQLite database.");

    // ===============================
    // TEAMS TABLE
    // ===============================
db.run(`
    CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_name TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        start_time INTEGER,
        submitted INTEGER DEFAULT 0,
        cheat_count INTEGER DEFAULT 0,
        is_blocked INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

    // ===============================
    // TEAM QUESTIONS (server-assigned)
    // ===============================
    db.run(`
        CREATE TABLE IF NOT EXISTS team_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            question_id INTEGER,
            type TEXT NOT NULL,
            grid_size INTEGER,
            puzzle_image TEXT,
            answered INTEGER DEFAULT 0,
            correct INTEGER DEFAULT 0,
            FOREIGN KEY (team_id) REFERENCES teams(id)
        )
    `);



    // ===============================
    // LOGIN LOGS
    // ===============================
    db.run(`
        CREATE TABLE IF NOT EXISTS login_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            login_time INTEGER NOT NULL,
            FOREIGN KEY (team_id) REFERENCES teams(id)
        )
    `);

    // ===============================
    // UNLOCKS TABLE
    // ===============================
    db.run(`
        CREATE TABLE IF NOT EXISTS unlocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER NOT NULL,
            element_name TEXT NOT NULL,
            UNIQUE(team_id, element_name),
            FOREIGN KEY (team_id) REFERENCES teams(id)
        )
    `);

    // ===============================
    // SUBMISSIONS TABLE
    // ===============================
    db.run(`
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_id INTEGER UNIQUE NOT NULL,
            layout_json TEXT NOT NULL,
            time_taken INTEGER,
            unlocked_count INTEGER,
            created_at INTEGER,
            FOREIGN KEY (team_id) REFERENCES teams(id)
        )
    `);

});

module.exports = db;
