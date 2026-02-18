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
            password TEXT NOT NULL,
            start_time INTEGER,
            submitted INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
