const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const productController = require('../controllers/productController');
const Product = require('../models/productModel');
const Barcode = require('../models/barcodeModel');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});

  app = express();
  app.use(express.json());

  // routes
  app.post('/api/product/add', productController.addProduct);
  app.post('/api/product/filter', productController.getFilteredProducts);
  app.get('/api/product/statistics', productController.getProductStatics);
  app.get('/api/product/:productId', productController.getProductById);
  app.get('/api/product/barcode/:barcode', productController.getProductByBarcode);
  app.delete('/api/product/:productId', productController.deleteProductById);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany();
  await Barcode.deleteMany();
});

describe('productController', () => {
  let productId;
  let barcode = '123456789';

  beforeEach(async () => {
    const product = await Product.create({
        _id: new mongoose.Types.ObjectId(),
      product_name: 'TestProduct',
      brands: 'TestBrand',
      countries_en: 'Spain',
      categories: 'Snacks',
      nutriscore_grade: 'b',
      energy_100g: 100,
      fat_100g: 10,
      carbohydrates_100g: 20,
      sugars_100g: 5,
      fiber_100g: 2,
      proteins_100g: 4,
      salt_100g: 0.5,
      sodium_100g: 0.2,
      image_url: 'http://example.com/image.jpg',
    });

    productId = product._id;

    await Barcode.create({
        _id: new mongoose.Types.ObjectId(),
      barcode: barcode,
      product_name: 'TestProduct',
    });
  });

  test('POST /api/product/filter - filters products', async () => {
    const res = await request(app)
      .post('/api/product/filter')
      .send({ name: 'testproduct' });

    expect(res.status).toBe(200);
    expect(res.body.products.length).toBe(1);
  });

  test('GET /api/product/statistics - returns product stats', async () => {
    const res = await request(app).get('/api/product/statistics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nutriscoreRatio');
    expect(res.body).toHaveProperty('categoryRatio');
    expect(res.body).toHaveProperty('brandRatio');
  });

  test('GET /api/product/:productId - gets product by ID', async () => {
    const res = await request(app)
      .get(`/api/product/${productId}?productName=TestProduct`);

    expect(res.status).toBe(200);
    expect(res.body.product_name).toBe('TestProduct');
    expect(res.body.barcode).toBe(barcode);
  });

  test('GET /api/product/barcode/:barcode - gets product by barcode', async () => {
    const res = await request(app).get(`/api/product/barcode/${barcode}`);
    expect(res.status).toBe(200);
    expect(res.body.product_name).toBe('TestProduct');
  });

  test('DELETE /api/product/:productId - deletes a product', async () => {
    const res = await request(app).delete(`/api/product/${productId}`);
    expect(res.status).toBe(200);

    const product = await Product.findById(productId);
    expect(product).toBeNull();
  });

  test('POST /api/product/add - adds a new product', async () => {
    const newProduct = {
        _id: new mongoose.Types.ObjectId(),
      product_name: 'NewProduct',
      brands: 'NewBrand',
      countries_en: 'France',
      categories: 'Beverages',
      energy_100g: 120,
      fat_100g: 2,
      carbohydrates_100g: 10,
      sugars_100g: 5,
      fiber_100g: 1,
      proteins_100g: 2,
      salt_100g: 0.1,
      sodium_100g: 0.05,
      image_url: 'http://example.com/new.jpg',
      nutriscore_grade: 'a',
    };

    const res = await request(app)
      .post('/api/product/add')
      .send(newProduct);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Producto guardado exitosamente');
  });
});
