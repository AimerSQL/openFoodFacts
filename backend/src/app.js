const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const cors = require('cors');

app.set('port', 4000);
app.use(cors());
app.use(express.json());

const options = {
    swaggerDefinition: {
        openapi : "3.0.0",
        info: {
            title: 'Open Food Facts', // Título de la API
            version: '1.0.0', // Versión de la API
            description: 'Documentación de la API de Open Food Facts', // Descripción de la API
        },
    },
    apis: ['./getProducts.js'], // Archivos que contienen la documentación de la API
};

const swaggerSpec = swaggerJsdoc(options);

//routers
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/food', require('./routers/food')); //obtener codigo de barra


module.exports = app;