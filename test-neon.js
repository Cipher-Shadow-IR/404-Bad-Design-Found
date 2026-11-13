const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config();

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
const { sql, initDB } = require("./404-Not-Found-Webapp/database");

async function run() {
  await initDB();
  const res = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log("Tables in Neon Postgres:");
  console.table(res);
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
