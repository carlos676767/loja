
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'Api de loja em desenvolvimento',
      version: '1.0.0',
      description: 'Documentação de API utilizando Swagger com Node.js',
    },
  },
  apis:  ['./routers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
