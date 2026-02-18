const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create Challenges Table
        db.run(`CREATE TABLE IF NOT EXISTS challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            type TEXT, 
            status TEXT DEFAULT 'locked'
        )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating some rows
                const insert = 'INSERT INTO challenges (title, description, type, status) VALUES (?,?,?,?)';
                db.run(insert, ["Quiz Challenge", "Pass the Quiz!", "quiz", "unlocked"]);
                db.run(insert, ["Image Puzzle", "Solve the Puzzle!", "puzzle", "unlocked"]);
                db.run(insert, ["Code Breaker", "Crack the Code!", "code", "unlocked"]);
                db.run(insert, ["Memory Game", "Match the Cards!", "memory", "unlocked"]);
            }
        });

        // Create Users/Designs Table (simplified)
        db.run(`CREATE TABLE IF NOT EXISTS designs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            team_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
             if (err) {
                 console.error("Error creating users table:", err.message);
            }
        });
    }
});

module.exports = db;
