const fs = require('fs');
const DB_FILE = './data.json';

// Initialiseer database als die niet bestaat
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ klanten: [], opdrachten: [] }));
}

module.exports = {
    read: () => JSON.parse(fs.readFileSync(DB_FILE)),
    write: (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
};
