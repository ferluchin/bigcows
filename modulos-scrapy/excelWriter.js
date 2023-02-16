const ExcelJS = require('exceljs');
const async = require('async');
// = require('../scrape.js');
async.mapSeries(Object.keys(people), scrapeEntry, function (err, results) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Define an array of column headers
    const columnHeaders = [
        { header: 'Name', key: 'name' },
        { header: 'URL', key: 'url' },
        { header: 'Photo', key: 'photo' },
        { header: 'Affiliation', key: 'affiliation' },
        { header: 'Keywords', key: 'keywords' },
        { header: 'Citations - All time', key: 'citationsAllTime' },
        { header: 'Citations - Since 2018', key: 'citationsSince2018' },
        { header: 'H-Index - All time', key: 'hindexAllTime' },
        { header: 'H-Index - Since 2018', key: 'hindexSince2018' },
        { header: 'I10-Index - All time', key: 'i10indexAllTime' },
        { header: 'I10-Index - Since 2018', key: 'i10indexSince2018' },
        { header: 'Year', key: 'year' },
    ];

    // Add the collaborator headers to the column headers array
    for (let i = 1; i <= 10; i++) {
        columnHeaders.push({ header: `Collaborator ${i}`, key: `collaborator${i}` });
    }

    // Agregar encabezados de columna
    worksheet.columns = columnHeaders;

    // Agregar datos
    results.forEach(function (result) {
        const collaboratorData = {};
        for (let i = 1; i <= 10; i++) {
            collaboratorData[`collaborator${i}`] = result.collaborators[i - 1] || '';
        }
        worksheet.addRow({
            name: result.name,
            url: result.url,
            photo: result.photo,
            affiliation: result.affiliation,
            keywords: result.keywords.join(', '),
            citationsAllTime: result.stats.citations[0],
            citationsSince2018: result.stats.citations[1],
            hindexAllTime: result.stats.hindex[0],
            hindexSince2018: result.stats.hindex[1],
            i10indexAllTime: result.stats.i10index[0],
            i10indexSince2018: result.stats.i10index[1],
            year: result.year,
            ...collaboratorData,
        });
    });
    const outputFileExcel = `stats-${inputName}`;
    // Guardar el archivo Excel
    workbook.xlsx.writeFile(`${outputFileExcel}.xlsx`)
        .then(function () {
            console.log('File saved! as ' + outputFileExcel + '.xlsx');
        });
});

module.exports = excelWriter;