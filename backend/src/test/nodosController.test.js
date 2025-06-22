const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const nodosController = require('../controllers/nodosController');
const nodosModel = require('../models/nodosModel');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.post('/api/nodos', nodosController.getNodos);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await nodosModel.deleteMany();
});

describe('nodosController.getNodos', () => {
  it('should return averaged, grouped, and max/min nodos', async () => {
    const now = Date.now();
    const oneHour = 1000 * 60 * 60;

    await nodosModel.insertMany([
      {
        entity_id: 'sensor_1',
        time_index: new Date(now),
        tvoc: 100,
        eco2: 500,
        humedad: 40,
        temperatura: 22,
      },
      {
        entity_id: 'sensor_1',
        time_index: new Date(now + oneHour),
        tvoc: 200,
        eco2: 600,
        humedad: 45,
        temperatura: 24,
      },
      {
        entity_id: 'sensor_2',
        time_index: new Date(now),
        tvoc: 300,
        eco2: 700,
        humedad: 50,
        temperatura: 26,
      }
    ]);

    const res = await request(app)
      .post('/api/nodos')
      .send({
        start: now - oneHour,
        end: now + 2 * oneHour
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('avg');
    expect(res.body).toHaveProperty('nodos');
    expect(res.body).toHaveProperty('maxMin');

    // avg 验证
    const avgSensor1 = res.body.avg.find(n => n.entity_id === 'sensor_1');
    expect(avgSensor1.tvoc).toBe(150); // 平均值 (100+200)/2
    expect(avgSensor1.eco2).toBe(550);

    // nodos 原始分组验证
    expect(res.body.nodos.sensor_1.length).toBe(2);
    expect(res.body.nodos.sensor_2.length).toBe(1);

    // maxMin 验证
    const mm = res.body.maxMin.find(m => m.maxNodo.entity_id === 'sensor_1');
    expect(mm.maxNodo.tvoc).toBe(200);
    expect(mm.minNodo.tvoc).toBe(100);
  });

  it('should handle errors gracefully', async () => {
    // 模拟错误
    const spy = jest.spyOn(nodosModel, 'find').mockRejectedValueOnce(new Error('Mocked Error'));

    const res = await request(app)
      .post('/api/nodos')
      .send({
        start: Date.now() - 10000,
        end: Date.now()
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'error get');

    spy.mockRestore();
  });
});
