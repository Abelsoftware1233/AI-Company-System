const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const path = require('path');

const app = express();
const DB_FILE = './data.json';
const FACTUUR_MAP = './facturen';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database & Factuur map check
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ klanten: [] }));
if (!fs.existsSync(FACTUUR_MAP)) fs.mkdirSync(FACTUUR_MAP);

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// API: Alle klanten ophalen
app.get('/api/klanten', (req, res) => {
    res.json(readDB().klanten);
});

// API: Klant toevoegen
app.post('/api/klanten', (req, res) => {
    const data = readDB();
    const nieuweKlant = { id: uuidv4(), ...req.body };
    data.klanten.push(nieuweKlant);
    writeDB(data);
    res.status(201).json(nieuweKlant);
});

// API: Factuur Genereren
app.post('/api/factureer', (req, res) => {
    const { klantId, omschrijving, bedrag } = req.body;
    const data = readDB();
    const klant = data.klanten.find(k => k.id === klantId);
    
    if (!klant) return res.status(404).json({ error: 'Klant niet gevonden' });

    const factuurNaam = `Factuur_${klant.naam.replace(/\s/g, '_')}_${Date.now()}.pdf`;
    const filePath = path.join(FACTUUR_MAP, factuurNaam);
    
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    
    doc.fontSize(20).text('UW BEDRIJF B.V.', { align: 'right' });
    doc.fontSize(10).text('Kvk: 12345678 | BTW: NL00001111B01', { align: 'right' });
    doc.moveDown();
    doc.fontSize(12).text(`Factuur aan: ${klant.naam}`);
    doc.text(`Adres: ${klant.adres}`);
    doc.text(`BTW: ${klant.btwNummer}`);
    doc.moveDown();
    doc.text('----------------------------------------------');
    doc.text(`${omschrijving} : €${bedrag}`);
    doc.text(`BTW (21%): €${(bedrag * 0.21).toFixed(2)}`);
    doc.fontSize(14).text(`Totaal incl. BTW: €${(bedrag * 1.21).toFixed(2)}`, { bold: true });
    doc.end();

    res.json({ message: 'Factuur succesvol aangemaakt!', file: factuurNaam });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Systeem draait op http://localhost:${PORT}`));
