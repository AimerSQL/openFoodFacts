const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const options = {
    swaggerDefinition: {
        info: {
            title: 'API de ejemplo', // Título de la API
            version: '1.0.0', // Versión de la API
            description: 'Documentación de la API de ejemplo', // Descripción de la API
        },
    },
    apis: ['./controllers/getProducts'], // Archivos que contienen la documentación de la API
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


module.exports = swaggerDocs;