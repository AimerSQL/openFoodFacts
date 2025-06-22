const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const productModel = require('../models/productModel');
const foodController = require('../controllers/foodController');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  // 路由定义
  app.get('/api/foods', foodController.getAllFoods);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await productModel.deleteMany();
});

describe('foodController.getAllFoods', () => {
  it('should return paginated food products', async () => {
    // 添加模拟数据
    for (let i = 1; i <= 20; i++) {
      await productModel.create({
        _id: new mongoose.Types.ObjectId(),
        product_name: `Producto ${i}`,
        brands: `Marca ${i}`,
        countries_en: 'Spain',
        ingretients_text: `Ingredientes ${i}`,
        image_url: `http://example.com/${i}.jpg`,
        categories: `Categoria ${i}`,
      });
    }

    const response = await request(app)
      .get('/api/foods')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(10);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalCount).toBe(20);
    expect(response.body.currentPage).toBe('1'); // page 是字符串因 query 传入
  });

  it('should handle server errors gracefully', async () => {
    // 暂时断开数据库连接来触发错误
    await mongoose.disconnect();

    const response = await request(app)
      .get('/api/foods')
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'error get');

    // 重新连接用于后续测试
    await mongoose.connect(mongoServer.getUri());
  });
});
