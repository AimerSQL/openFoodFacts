const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "Open Food Facts", // Título de la API
      version: "1.0.0", // Versión de la API
      description: "Documentación de la API de Open Food Facts", // Descripción de la API
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  apis: ["src/api.js"], // Archivos que contienen la documentación de la API
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpec;
