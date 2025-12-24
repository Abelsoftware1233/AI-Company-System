const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const DB_FILE = './data.json';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Hiermee tonen we de frontend

// Database initialisatie
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ klanten: [], opdrachten: [] }));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// API Routes
app.get('/api/klanten', (req, res) => {
    res.json(readDB().klanten);
});

app.post('/api/klanten', (req, res) => {
    const data = readDB();
    const nieuweKlant = { id: uuidv4(), ...req.body };
    data.klanten.push(nieuweKlant);
    writeDB(data);
    res.status(201).json(nieuweKlant);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
