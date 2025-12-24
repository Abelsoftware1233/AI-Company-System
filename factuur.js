const PDFDocument = require('pdfkit');
const fs = require('fs');

function genereerFactuur(klant, opdracht, bestandsnaam) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(bestandsnaam));

    // Logo of Bedrijfsnaam
    doc.fontSize(20).text('MIJN BEDRIJF B.V.', { align: 'right' });
    doc.fontSize(10).text('Straatnaam 1, 1234 AB, Stad', { align: 'right' });
    doc.moveDown();

    // Klantgegevens
    doc.fontSize(12).text('Factuur voor:', { underline: true });
    doc.text(`Naam: ${klant.naam}`);
    doc.text(`Adres: ${klant.adres}`);
    doc.text(`BTW-Nummer: ${klant.btwNummer}`);
    doc.moveDown();

    // Factuurdetails
    doc.fontSize(14).text(`Factuur #INV-${Date.now()}`, { bold: true });
    doc.text(`Opdrachtnummer: ${opdracht.opdrachtNummer}`);
    doc.moveDown();

    // Tabel-achtig overzicht
    doc.text('------------------------------------------------------------');
    doc.text(`Omschrijving: ${opdracht.omschrijving}`);
    doc.text(`Bedrag (excl. BTW): €${opdracht.bedrag}`);
    doc.text(`BTW (21%): €${(opdracht.bedrag * 0.21).toFixed(2)}`);
    doc.text('------------------------------------------------------------');
    doc.fontSize(16).text(`Totaal: €${(opdracht.bedrag * 1.21).toFixed(2)}`, { bold: true });

    doc.end();
    console.log(`Factuur ${bestandsnaam} is aangemaakt!`);
}

module.exports = { genereerFactuur };
