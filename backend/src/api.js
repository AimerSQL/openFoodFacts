const express = require('express');
const router = express.Router();
const foodController = require('./controllers/foodController');
const productController = require('./controllers/productController');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: get products
 *     description: get products
 *     responses:
 *       200:
 *         description: successful get
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
  * /products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     description: Returns a single product by its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/products'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 * 

 * 
 * /filtered-products:
 *   post:
 *     summary: get filter products
 *     description: get filter products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categories:
 *                 type: string
 *               brands:
 *                 type: string
 *               countries:
 *                 type: string
 *     responses:
 *       200:
 *         description: get products
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
 * 
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The product ID
 * 
 */

router.get('/products', async (req, res) => {
    await foodController.getAllFoods(req, res);
});

router.get('/products/:productId', async (req, res) => {
    await productController.getProductById(req, res);
  
  });

router.post('/filtered-products', async (req, res) => {
    await productController.getFilteredProducts(req, res);
});


module.exports = router;



