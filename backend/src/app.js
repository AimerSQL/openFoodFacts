const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const cors = require('cors');

app.set('port', 4000);
app.use(cors());
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi : "3.0.3",
        info: {
            title: 'Open Food Facts', // Título de la API
            version: '1.0.0', // Versión de la API
            description: 'Documentación de la API de Open Food Facts', // Descripción de la API
        },
    },
    apis: ['src/app.js'], // Archivos que contienen la documentación de la API
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

//routers
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(swaggerSpec)
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

//app.use('/food', require('./routers/food'));

// 定义 GET 产品 API
/**
 * @swagger
 * /products:
 *   get:
 *     summary: 获取产品列表
 *     description: 获取所有产品的列表
 *     responses:
 *       200:
 *         description: 成功获取产品列表
 */
app.get('/products', (req, res) => {
    // TODO: 实现获取产品列表的逻辑
    res.send('获取产品列表');
});

module.exports = app;