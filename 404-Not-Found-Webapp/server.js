const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect("./Auth/login.html");
});

app.post("/login", (req, res) => {
    const { team_name, password } = req.body;

    if (!team_name || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(password)) {
        return res.status(400).json({
            message: "Phone number must be 10 digits"
        });
    }

    const now = Date.now();

    // Check if team already exists
    db.get(
        "SELECT * FROM teams WHERE team_name = ?",
        [team_name],
        (err, team) => {

            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            // 🔵 If team exists
            if (team) {

                if (team.password !== password) {
                    return res.status(401).json({
                        message: "Incorrect phone number"
                    });
                }

                // Set start_time if not already set
                if (!team.start_time) {
                    db.run(
                        "UPDATE teams SET start_time = ? WHERE id = ?",
                        [now, team.id]
                    );
                    team.start_time = now;
                }

                // Log login
                db.run(
                    "INSERT INTO login_logs (team_id, login_time) VALUES (?, ?)",
                    [team.id, now]
                );

                return res.json({
                    team_id: team.id,
                    team_name: team.team_name,
                    start_time: team.start_time
                });
            }

            // 🟢 If team does NOT exist → Register automatically
            db.run(
                "INSERT INTO teams (team_name, password, start_time) VALUES (?, ?, ?)",
                [team_name, password, now],
                function (insertErr) {
                    if (insertErr) {
                        return res.status(500).json({ message: "Registration failed" });
                    }

                    const newTeamId = this.lastID;

                    // Log login
                    db.run(
                        "INSERT INTO login_logs (team_id, login_time) VALUES (?, ?)",
                        [newTeamId, now]
                    );

                    return res.json({
                        team_id: newTeamId,
                        team_name: team_name,
                        start_time: now
                    });
                }
            );
        }
    );
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});
