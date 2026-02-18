const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// Signup
app.post('/api/signup', (req, res) => {
    const { username, password, team_name } = req.body;
    const sql = 'INSERT INTO users (username, password, team_name) VALUES (?,?,?)';
    db.run(sql, [username, password, team_name], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, username, team_name }
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (row) {
            res.json({
                "message": "success",
                "data": { id: row.id, username: row.username, team_name: row.team_name }
            });
        } else {
            res.status(401).json({ "message": "Invalid credentials" });
        }
    });
});

// Get all challenges
app.get('/api/challenges', (req, res) => {
    const sql = 'SELECT * FROM challenges';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Save design (placeholder for now, could save JSON to DB)
app.post('/api/save-design', (req, res) => {
    const { designData, userId, username, team_name } = req.body;
    const timestamp = new Date().toISOString();

    // Parse design data to extract useful info
    let parsedDesign = {};
    let elementCount = 0;
    try {
        parsedDesign = JSON.parse(designData);
        // Count elements (children of the first layer, minus transformer)
        if (parsedDesign.children && parsedDesign.children[0] && parsedDesign.children[0].children) {
            elementCount = parsedDesign.children[0].children.filter(c => c.className !== 'Transformer').length;
        }
    } catch (e) {
        parsedDesign = designData;
    }

    // Pretty console log
    console.log('\n========================================');
    console.log('  📤 DESIGN SUBMISSION RECEIVED');
    console.log('========================================');
    console.log(`  👤 User     : ${username || 'Unknown'} (ID: ${userId || 'N/A'})`);
    console.log(`  👥 Team     : ${team_name || 'N/A'}`);
    console.log(`  🕐 Time     : ${timestamp}`);
    console.log(`  🎨 Elements : ${elementCount}`);
    console.log('========================================\n');

    res.json({
        status: "success",
        message: "Design saved successfully",
        data: {
            userId: userId || null,
            username: username || null,
            team_name: team_name || null,
            submittedAt: timestamp,
            elementCount: elementCount
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
