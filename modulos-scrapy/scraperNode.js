var request = require('request');
var cheerio = require('cheerio');

const fs = require('fs');
// Establecer la codificación al leer el archivo
const people = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

var scraperNode = function (person, doneCallback) {
    var url = people[person];
    var data = {};

    // Se realiza una solicitud GET para obtener el HTML del perfil del investigador.
    // Se utiliza la biblioteca "request" para realizar la solicitud.
    request({ encoding: 'utf8', method: "GET", uri: url }, function (err, resp, body) {

        // Se utiliza la biblioteca "cheerio" para analizar el HTML y extraer la información necesaria del perfil.
        var $ = cheerio.load(body);
        try {
            // Se imprime un mensaje en la consola para indicar que se está realizando el raspado.
            console.error("Scraping " + person + "...");

            // Se extraen la foto y la afiliación del investigador.
            var photo = $('#gsc_prf_pup-img')[0].attribs.src;
            var affiliation = $('.gsc_prf_il', '#gsc_prf_i').first().text();

            // Se extraen las palabras clave del investigador.
            var keywords_root = $('#gsc_prf_int')[0].children;
            var keywords = [];
            for (var i = 0; i < keywords_root.length; i++) {
                keywords.push(keywords_root[i].children[0].data);
            }

            // Se extraen las estadísticas de citas del investigador.
            var rawStats = $('#gsc_rsb_st');
            var stats = {
                'citations': [rawStats[0].children[1].children[0].children[1].children[0].data,
                rawStats[0].children[1].children[0].children[2].children[0].data],
                'hindex': [rawStats[0].children[1].children[1].children[1].children[0].data,
                rawStats[0].children[1].children[1].children[2].children[0].data],
                'i10index': [rawStats[0].children[1].children[2].children[1].children[0].data,
                rawStats[0].children[1].children[2].children[2].children[0].data]
            };

            // Se extraen los colaboradores del investigador.
            var collaboratorEls = $('#gsc_rsb_co a');
            var collaborators = [];
            collaboratorEls.each(function (index, element) {
                collaborators.push($(element).text());
            });

            // Se extrae el año de la última publicación del investigador.
            var rawYear = $('.gsc_md_hist_b');

            /*
            // Se extrae la tabla de citas por año del investigador.
            var rawCitationsByYear = $('#gsc_rsb_st_tbl tbody');
            var citationsByYear = {};
            $('tr', rawCitationsByYear).each(function (i, row) {
                if (i == 0) {
                    // La primera fila contiene los años
                    $('td', row).each(function (j, cell) {
                        if (j > 0) {
                            // Los años comienzan en la columna 2
                            var year = parseInt($(cell).text());
                            citationsByYear[year] = 0;
                        }
                    });
                } else {
                    // Las filas restantes contienen el número de citas por año
                    var cells = $('td', row);
                    var currentYear = null;
                    cells.each(function (j, cell) {
                        if (j == 0) {
                            // La primera celda contiene el año
                            currentYear = parseInt($(cell).text());
                        } else {
                            // Las celdas restantes contienen el número de citas
                            var citations = parseInt($(cell).text());
                            citationsByYear[currentYear] += citations;
                        }
                    });
                }
            });

            */
            // Se guarda toda la información extraída en un objeto de datos.
            data = {
                'name': person,
                'url': url,
                'photo': 'http://scholar.google.com' + photo,
                'affiliation': affiliation,
                'keywords': keywords,
                'stats': stats,
                'year': rawYear[0].children[0].children[0].data,
                'collaborators': collaborators,
                //'citationsByYear': {}
            };
            // Se añaden las citas por año al objeto de datos.

            /*
            data.citationsByYear = citationsByYear;
            console.log("🚀 ~ file: scraperNode.js:97 ~ citationsByYear", citationsByYear)
*/
            // Se llama a doneCallback para indicar que se ha terminado de extraer la información.
            //doneCallback(null, data);
        } catch (ex) {
            // Si se produce un error, se lanza una excepción y se detiene el scrap para el investigador actual.
            console.error(ex);
            throw new Error(person);
        }

        // Se utiliza un temporizador para controlar la velocidad de scrap.
        setTimeout(function () {
            doneCallback(null, data);
        }, 1000);
    });
};

module.exports = scraperNode;