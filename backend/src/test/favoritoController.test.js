const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const favoritoController = require('../controllers/favoritoController');
const Favorito = require('../models/favoritoModel');
const Product = require('../models/productModel');

let mongod, app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  // 手动挂载路由
  app.post('/favoritos', favoritoController.collectProductAndUser);
  app.delete('/favoritos/:user_id/:product_id', favoritoController.deleteFavoritoById);
  app.get('/favoritos/:user_id', favoritoController.getFavoritoByUserId);
  app.get('/favoritos/productos/:user_id', favoritoController.getProductoByFavorito);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Favorito.deleteMany();
  await Product.deleteMany();
});

test('collectProductAndUser - adds a favorito', async () => {
  const product = await Product.create({ _id: new mongoose.Types.ObjectId(), product_name: 'Test Product' });
  const res = await request(app).post('/favoritos').send({
    product_id: product._id,
    user_id: new mongoose.Types.ObjectId(),
  });

  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe('Product added to favorites');
});

test('deleteFavoritoById - deletes favorito successfully', async () => {
  const user_id = new mongoose.Types.ObjectId();
  const product_id = new mongoose.Types.ObjectId();

  await Favorito.create({ _id: new mongoose.Types.ObjectId(), product_id, user_id });

  const res = await request(app).delete(`/favoritos/${user_id}/${product_id}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('Favorito deleted successfully');
});

test('getFavoritoByUserId - returns favoritos for a user', async () => {
  const user_id = new mongoose.Types.ObjectId();
  const product_id = new mongoose.Types.ObjectId();

  await Favorito.create({ _id: new mongoose.Types.ObjectId(), product_id: new mongoose.Types.ObjectId(), user_id });

  const res = await request(app).get(`/favoritos/${user_id}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0]).toHaveProperty('product_id');
});

test('getProductoByFavorito - returns product data for favoritos', async () => {
  const user_id = new mongoose.Types.ObjectId();
  const product = await Product.create({
    _id: new mongoose.Types.ObjectId(),
    product_name: 'Favorito Product'
  });

  await Favorito.create({ _id: new mongoose.Types.ObjectId(), product_id: product._id, user_id });

  const res = await request(app).get(`/favoritos/productos/${user_id}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].product_name).toBe('Favorito Product');
});
