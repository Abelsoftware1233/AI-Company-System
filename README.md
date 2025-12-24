# AI-Company-System
Repository for the AI Company System

# Business ERP Systeem (JS)

Een basis B2B systeem voor het beheren van klantgegevens en opdrachten.

## Installatie
1. Clone deze repo.
2. Run `npm install`.
3. Start de server met `npm start`.
4. Ga naar `http://localhost:3000` in je browser.

## Features
- Klanten toevoegen met BTW-nummer.
- Lokale JSON database opslag.
- REST API interface.


Run dit commando in je terminal:
npm install bcryptjs express-session

Wat is er nu veranderd in je mappen?
Beveiliging: Je kunt niet meer direct naar /api/klanten gaan zonder in te loggen.
Database: In je data.json wordt nu een lijst met gebruikers bijgehouden met versleutelde wachtwoorden.
Flow: Als je de app opent, zie je eerst het login-scherm.
Je repository is nu een volwaardige Secure Web App. Vergeet niet de nieuwe wijzigingen te commiten naar GitHub!

Hoe krijg je dit aan de praat?
Installeer Node.js op je computer (als je dat nog niet hebt).
Open je terminal (CMD of PowerShell) in de map van je project.
Typ: npm install (dit installeert de benodigde onderdelen).
Typ: npm start.
Je server draait nu!
Hoe test je dit?
Je kunt nu geen website zien (want we hebben nog geen HTML/Frontend), maar je kunt de data testen met een programmaatje zoals Postman of via je browser op http://localhost:3000/klanten.

Open je terminal in de projectmap.
Run: npm install
Run: npm start
Ga naar http://localhost:3000.
Je GitHub Repository aanmaken:
Ga naar GitHub en maak een nieuwe repo.
In je terminal:
git init
git add .
git commit -m "Eerste release van ERP systeem"
git remote add origin [JOUW_GITHUB_LINK]
git push -u origin main


