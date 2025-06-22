const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = require("../controllers/userController");
const User = require("../models/userModel");

const app = express();
app.use(express.json());

// 设置临时路由用于测试 controller
app.post("/api/login", userController.getUserIdentical);
app.post("/api/register", userController.userRegiser);

// Mock Mongoose 的 User 模型方法
jest.mock("../models/userModel");

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("userRegiser", () => {
    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null); // 不存在该用户名
      User.prototype.save = jest.fn().mockResolvedValue();

      const response = await request(app).post("/api/register").send({
        username: "testuser",
        password: "testpassword",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("User registered successfully!");
    });

    it("should not register if username is taken", async () => {
      User.findOne.mockResolvedValue({ username: "testuser" });

      const response = await request(app).post("/api/register").send({
        username: "testuser",
        password: "testpassword",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Username already taken");
    });
  });

  describe("getUserIdentical", () => {
    it("should authenticate a valid user and return token", async () => {
      const hashedPassword = await bcrypt.hash("testpassword", 10);

      const fakeUser = {
        _id: new mongoose.Types.ObjectId(),
        username: "testuser",
        password: hashedPassword,
        role: "user",
      };

      User.findOne.mockResolvedValue(fakeUser);

      const response = await request(app).post("/api/login").send({
        username: "testuser",
        password: "testpassword",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe("testuser");
    });

    it("should reject invalid password", async () => {
      const hashedPassword = await bcrypt.hash("anotherpassword", 10);

      User.findOne.mockResolvedValue({
        username: "testuser",
        password: hashedPassword,
      });

      const response = await request(app).post("/api/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid password");
    });

    it("should return 404 for non-existent user", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/api/login").send({
        username: "notexist",
        password: "test",
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User not found");
    });
  });
});
