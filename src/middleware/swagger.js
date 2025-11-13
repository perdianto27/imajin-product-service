const swaggerUi = require('swagger-ui-express');
const path = require('path');
const redoc = require('redoc-express');

const logName = 'API Swagger';

module.exports = (app, isProduction = false) => {
  if (isProduction) {
    console.log(logName, "Swagger disabled in production");
    return;
  }

  try {
    const swaggerDocument = require(path.join(__dirname, '../swagger.json'));
    const options = { docExpansion: 'none', defaultModelsExpandDepth: -1 };
    const customCss = '.swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0; }';

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, true, options, customCss));
    app.get('/swagger.json', (req, res) => res.send(swaggerDocument));
    app.get('/docs', redoc({ title: 'API Docs', specUrl: '/swagger.json' }));

    console.log(logName, "Swagger documentation initialized");
  } catch (err) {
    console.log(logName, 'ERROR', err);
  }
};