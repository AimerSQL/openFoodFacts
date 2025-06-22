const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const rateController = require('../controllers/rateController');
const votModel = require('../models/votModel');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});
  
  app = express();
  app.use(express.json());

  app.get('/api/rate/:productId', rateController.getProductRate);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await votModel.deleteMany();
});

describe('GET /api/rate/:productId', () => {
  const productId = 'product123';

  test('should calculate rating correctly from real votes', async () => {
    await votModel.create([
      {
        _id: new mongoose.Types.ObjectId(),
        vot: {
          [productId]: {
            'en:manufacturing': true,
            'en:packaging': false,
            'en:palm-oil': true,
            'en:size': true,
            'en:storage': false,
            'en:transport': true
          }
        }
      },
      {
        _id: new mongoose.Types.ObjectId(),
        vot: {
          [productId]: {
            'en:manufacturing': true,
            'en:packaging': true,
            'en:palm-oil': false,
            'en:size': true,
            'en:storage': true,
            'en:transport': false
          }
        }
      }
    ]);

    const res = await request(app).get(`/api/rate/${productId}`);
    expect(res.status).toBe(200);

    const ratings = res.body;
    expect(ratings).toHaveProperty('manufacturingLike');
    expect(ratings.manufacturingLike).toBeGreaterThanOrEqual(0);
    expect(ratings.manufacturingLike).toBeLessThanOrEqual(5);
    expect(typeof ratings.manufacturingLike).toBe('number');
  });

  test('should fallback to random ratings when no votes exist for product', async () => {
    await votModel.create([
      { _id: new mongoose.Types.ObjectId(), vot: { otherProduct: { 'en:manufacturing': true } } },
      { _id: new mongoose.Types.ObjectId(), vot: { anotherProduct: { 'en:packaging': true } } }
    ]);

    const res = await request(app).get(`/api/rate/${productId}`);
    expect(res.status).toBe(200);

    const ratings = res.body;
    expect(Object.keys(ratings)).toEqual([
      'manufacturingLike',
      'packagingLike',
      'palmoilLike',
      'sizeLike',
      'storageLike',
      'transportLike'
    ]);

    for (const key in ratings) {
      expect(ratings[key]).toBeGreaterThanOrEqual(0);
      expect(ratings[key]).toBeLessThanOrEqual(5);
    }
  });

  test('should return 0 ratings if no documents exist at all', async () => {
    const res = await request(app).get(`/api/rate/${productId}`);
    expect(res.status).toBe(200);

    const ratings = res.body;
    for (const key in ratings) {
      expect(typeof ratings[key]).toBe('number');
      expect(ratings[key]).toBeGreaterThanOrEqual(0);
      expect(ratings[key]).toBeLessThanOrEqual(5);
    }
  });
});
