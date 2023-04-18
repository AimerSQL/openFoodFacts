const express = require('express');
const axios = require('axios');
const votModel = require('./models/votModel'); // 注意文件路径可能需要根据实际情况进行调整

const router = express.Router();
const foodController = require('./controllers/foodController'); // 引入 foodController 模块

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
router.get('/products', async (req, res) => {
    // 在这里调用 foodController 模块中的处理函数
    await foodController.getAllFoods(req, res);
});

module.exports = router;
