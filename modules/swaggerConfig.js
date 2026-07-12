const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'This is a sample API',
    },
  },
  apis: ['./routes/*.js', './server.js'],
};

function initSwagger(app) {
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(specs)
  );
}

module.exports = {
  options,
  initSwagger,
};