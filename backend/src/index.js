require('./conexion');
const userRoute = require("./getProducts");
const express = require('express');
const app = express();
const cors = require('cors');

//swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

app.set('port', 4000);
app.use(cors());
app.use(express.json());
app.use("/api", userRoute);



//routers
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/food', require('./routers/food')); //obtener codigo de barra

app.listen(4000, () => console.log("server running on port ", app.get('port')))