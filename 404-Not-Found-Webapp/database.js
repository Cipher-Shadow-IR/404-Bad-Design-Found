// database.js
const path = require("path");
const dotenv = require("dotenv");

// Load .env.local first (from Neon CLI), then fall back to .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") });
dotenv.config();

const { neon } = require("@neondatabase/serverless");

// Fetch connection string from environment
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
    console.warn("⚠️ WARNING: Neither DATABASE_URL nor NEON_DATABASE_URL is set in environment.");
}

const sql = neon(databaseUrl || "postgres://placeholder:placeholder@localhost/placeholder");

// Auto-initialize schema in Neon Postgres
let initPromise = null;

async function initDB() {
    if (initPromise) return initPromise;
    if (!databaseUrl) {
        console.warn("Skipping DB schema init because DATABASE_URL is not set.");
        return;
    }

    initPromise = (async () => {
        try {
            // Teams Table
            await sql`
                CREATE TABLE IF NOT EXISTS teams (
                    id SERIAL PRIMARY KEY,
                    team_name TEXT UNIQUE NOT NULL,
                    phone TEXT NOT NULL,
                    start_time BIGINT,
                    submitted INT DEFAULT 0,
                    cheat_count INT DEFAULT 0,
                    is_blocked INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;

            // Team Questions Table
            await sql`
                CREATE TABLE IF NOT EXISTS team_questions (
                    id SERIAL PRIMARY KEY,
                    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                    element_name TEXT,
                    question_id INT,
                    type TEXT NOT NULL,
                    grid_size INT,
                    puzzle_image TEXT,
                    answered INT DEFAULT 0,
                    correct INT DEFAULT 0
                );
            `;

            // Login Logs Table
            await sql`
                CREATE TABLE IF NOT EXISTS login_logs (
                    id SERIAL PRIMARY KEY,
                    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                    login_time BIGINT NOT NULL
                );
            `;

            // Unlocks Table
            await sql`
                CREATE TABLE IF NOT EXISTS unlocks (
                    id SERIAL PRIMARY KEY,
                    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                    element_name TEXT NOT NULL,
                    UNIQUE(team_id, element_name)
                );
            `;

            // Drafts Table
            await sql`
                CREATE TABLE IF NOT EXISTS drafts (
                    team_id INT PRIMARY KEY REFERENCES teams(id) ON DELETE CASCADE,
                    layout_json TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;

            // Submissions Table
            await sql`
                CREATE TABLE IF NOT EXISTS submissions (
                    id SERIAL PRIMARY KEY,
                    team_id INT UNIQUE NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
                    layout_json TEXT NOT NULL,
                    time_taken INT,
                    unlocked_count INT,
                    created_at BIGINT
                );
            `;

            console.log("✅ Neon Database schema verified and initialized.");
        } catch (err) {
            console.error("❌ Failed to initialize Neon database schema:", err);
            initPromise = null;
            throw err;
        }
    })();

    return initPromise;
}

module.exports = {
    sql,
    initDB
};
