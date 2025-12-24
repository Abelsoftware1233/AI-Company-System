const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const DB_FILE = './data.json';
const FACTUUR_MAP = './facturen';

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'jouw-geheime-sleutel',
    resave: false,
    saveUninitialized: false
}));

// Database & Factuur map check
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ klanten: [], gebruikers: [] }));
if (!fs.existsSync(FACTUUR_MAP)) fs.mkdirSync(FACTUUR_MAP);

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Middleware om te checken of iemand is ingelogd
const checkAuth = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: 'Niet ingelogd' });
};

// --- AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const data = readDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    data.gebruikers.push({ id: uuidv4(), email, password: hashedPassword });
    writeDB(data);
    res.json({ message: 'Gebruiker aangemaakt' });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const data = readDB();
    const user = data.gebruikers.find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        return res.json({ message: 'Ingelogd!' });
    }
    res.status(401).json({ error: 'Ongeldige inloggegevens' });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Uitgelogd' });
});

// --- BEVEILIGDE ROUTES ---
app.get('/api/klanten', checkAuth, (req, res) => res.json(readDB().klanten));

app.post('/api/klanten', checkAuth, (req, res) => {
    const data = readDB();
    const nieuweKlant = { id: uuidv4(), ...req.body };
    data.klanten.push(nieuweKlant);
    writeDB(data);
    res.status(201).json(nieuweKlant);
});

app.post('/api/factureer', checkAuth, (req, res) => {
    // ... (De rest van je factuur code blijft hetzelfde)
    res.json({ message: 'Factuur aangemaakt' });
});

// Serveer de frontend pas na de API check
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
