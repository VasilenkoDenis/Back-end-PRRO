const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PRRO backend API',
      version: '1.0.0',
      description: 'This is the API for the PRRO backend application. It provides endpoints for user registration, authentication, and other functionalities.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    paths: {
      '/sign-in': {
        post: {
          summary: 'Реєстрація користувача',
          description: 'Реєстрація користувача в системі.',
          tags: ['Authentication'],
          operationId: 'signIn',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string', 
                      description: 'Електронна адреса користувача',
                      example: 'user@example.com',
                    },
                    password: {
                      type: 'string',
                      description: 'Пароль користувача',
                      example: 'password123',
                    },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Успішна реєстрація користувача',
            },
          },
        },
      },
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