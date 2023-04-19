const express = require('express');
const router = express.Router();
const foodController = require('./controllers/foodController'); // 引入 foodController 模块

/**
 * @swagger
 * /products:
 *   get:
 *     summary: 获取产品列表
 *     description: 获取所有产品的列表
 *     responses:
 *       200:
 *         description: 成功获取产品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 * 
 * components:
 *   schemas:
 *     products:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The product ID
 *         image_url:
 *           type: string
 *           description: The product image URL
 *         product_name:
 *           type: string
 *           description: The product name
 *         ingretients_text:
 *           type: string
 *         brand:
 *           type: string
 *           description: The brand of the product
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           description: The categories of the product
 *         countries_en:
 *           type: string
 *           description: The country of origin of the product
 */

router.get('/products', async (req, res) => {
    await foodController.getAllFoods(req, res);
});

module.exports = router;
