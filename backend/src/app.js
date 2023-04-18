// app.js 文件

const express = require('express');
const cors = require('cors');
const swaggerSpec = require('./swagger');
const apiRoutes = require('./api'); // 导入 api.js 文件

const app = express();

app.set('port', 4000);
app.use(cors());
app.use(express.json());

// 设置 Swagger UI
app.use('/api-docs', require('swagger-ui-express').serve, require('swagger-ui-express').setup(swaggerSpec));
//app.use('/food', require('./routers/food')); //obtener codigo de barra
// 使用 api.js 中的路由
app.use(apiRoutes);

module.exports = app;
