Google Scholar
===============

Escribí este scraper utilidad para obtener las estadísticas de citas de los perfiles de los investigadores en [Google Scholar](http://scholar.google.com/), implementando node.js [node.js](http://nodejs.org/). Empecé con una lista de investigadores en recuperación de información, pero desde entonces la he ampliado para incluir una lista separada de investigadores en interacción persona-ordenador. 

Los datos resultantes en formato excel son importados a la herramienta de visualización de datos Power BI para su análisis y visualización.

**Nota editorial**: 
Esta lista sólo contiene investigadores que tienen un perfil en Google Scholar; 

USO DE LA HERRAMIENTA GOOGLE SCHOLAR SCRAPER
---------------------

Se requiere [node.js](http://nodejs.org/) instalado, 

Se instalan todos los paquetes requeridos para el scraper:

$ npm install 

Se ejecuta el scraper de la siguiente manera:

$ node scrape.js ./people-hci.json

```
$ npm install request cheerio async
$ node scrape.js ./people-ir.json > stats-ir.js
$ node scrape.js ./people-db.json > stats-db.js
$ node scrape.js ./people-nlp.json > stats-nlp.js
$ node scrape.js ./people-hci.json > stats-hci.js
$ node scrape.js ./people-usfq.json > stats-usfq.js
$ node scrape.js ./people-stratosphere.json > stats-stratosphere.js
```

Para realizar scrapping de las imagenes de los investigadores, se ejecuta el siguiente comando:

```
$ node download-images.js ./stats-ir.js
$ node download-images.js ./stats-db.js
$ node download-images.js ./stats-nlp.js
$ node download-images.js ./stats-hci.js
$ node download-images.js ./stats-usfq.js
$ node download-images.js ./stats-stratosphere.js
```

A continuación, abra `index.html` y debería mostrar las nuevas estadísticas.


