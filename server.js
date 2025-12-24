const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// 1. Haal alle klanten op
app.get('/klanten', (req, res) => {
    const data = db.read();
    res.json(data.klanten);
});

// 2. Voeg een nieuwe klant toe (met BTW nummer)
app.post('/klanten', (req, res) => {
    const data = db.read();
    const nieuweKlant = {
        id: uuidv4(),
        naam: req.body.naam,
        btwNummer: req.body.btwNummer,
        adres: req.body.adres
    };
    
    data.klanten.push(nieuweKlant);
    db.write(data);
    res.status(201).json(nieuweKlant);
});

// 3. Maak een opdracht aan voor een klant
app.post('/opdrachten', (req, res) => {
    const data = db.read();
    const nieuweOpdracht = {
        opdrachtNummer: `ORD-${Date.now()}`,
        klantId: req.body.klantId,
        omschrijving: req.body.omschrijving,
        bedrag: req.body.bedrag
    };

    data.opdrachten.push(nieuweOpdracht);
    db.write(data);
    res.status(201).json(nieuweOpdracht);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Systeem draait op http://localhost:${PORT}`);
});
