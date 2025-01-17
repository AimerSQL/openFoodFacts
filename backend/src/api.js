const express = require("express");
const router = express.Router();
const foodController = require("./controllers/foodController");
const productController = require("./controllers/productController");
const rateController = require("./controllers/rateController");
const nodosController = require("./controllers/nodosController");
const userController = require("./controllers/userController");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key";

/**
 * @swagger
 * /products:
 *   get:
 *     summary: get products
 *     description: get products
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful get
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 *
 * /nodos:
 *   post:
 *     summary: post nodos
 *     description: post nodos
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 *     responses:
 *       200:
 *         description: successful psot
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/nodos'
 *
 * /products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     description: Returns a single product by its ID
 *     security:
 *      - bearerAuth: []
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
 * /products/barcode/{barcode}:
 *   get:
 *     summary: Get a product by barcode
 *     description: Returns a single product by its barcode
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         description: barcode of the product to retrieve
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
 * /rate-products/{productId}:
 *   get:
 *     summary: Get a product rate by ID
 *     description: Get a product rate by ID
 *     security:
 *      - bearerAuth: []
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
 *               $ref: '#/components/schemas/rate'
 *       404:
 *         description: rate not found
 *       500:
 *         description: Internal server error
 *
 *
 * /filtered-products:
 *   post:
 *     summary: get filter products
 *     description: get filter products
 *     security:
 *      - bearerAuth: []
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
 * /user:
 *   post:
 *     summary: get user
 *     description: get user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User found"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
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
 *     rate:
 *       type: object
 *       properties:
 *         manufacturing:
 *           type: string
 *         packaging:
 *           type: string
 *         palm-oil:
 *           type: string
 *         size:
 *           type: string
 *         storage:
 *           type: string
 *         transport:
 *           type: string
 *     nodos:
 *       type: object
 *       properties:
 *         entity_id:
 *           type: string
 *         time_index:
 *           type: integer
 *         tvoc:
 *           type: integer
 *         eco2:
 *           type: integer
 *         humedad:
 *           type: integer
 *         temperatura:
 *           type: integer
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The product ID
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // 检查 Authorization 头是否存在
  if (authHeader == null) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 提取 token 部分（去掉 Bearer 前缀）
  const token = authHeader && authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: err });

    req.user = user;
    next();
  });
}

router.get("/products", authenticateToken, async (req, res) => {
  await foodController.getAllFoods(req, res);
});

router.get("/products/:productId", authenticateToken, async (req, res) => {
  await productController.getProductById(req, res);
});

router.get(
  "/products/barcode/:barcode",
  authenticateToken,
  async (req, res) => {
    await productController.getProductByBarcode(req, res);
  }
);

router.post("/filtered-products", authenticateToken, async (req, res) => {
  await productController.getFilteredProducts(req, res);
});

router.get("/rate-products/:productId", authenticateToken, async (req, res) => {
  await rateController.getProductRate(req, res);
});

router.post("/nodos", authenticateToken, async (req, res) => {
  await nodosController.getNodos(req, res);
});

router.post("/user", async (req, res) => {
  console.log("POST /user endpoint hit");
  await userController.getUserIdentical(req, res);
});

router.delete('/products/:productId',async(req,res) => {
  await productController.deleteProductById(req,res);
});
// router.delete('/products/:productId', productController.deleteProductById);

module.exports = router;
