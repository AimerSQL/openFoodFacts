const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const  userController = {};

// 假设你有一个密钥用于签发 JWT
const JWT_SECRET = "your_secret_key";

userController.getUserIdentical = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ username });

    if (user) {
      // 验证密码
      //const isMatch = await bcrypt.compare(password, user.password);
      if (password === user.password) {
        // 生成 JWT
        const token = jwt.sign(
          {
            id: user._id,
            username: user.username,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: "1h" } // 设置过期时间，如1小时
        );

        // 返回 token 和用户信息
        res.json({
          success: true,
          message: "User authenticated",
          token: token,
          user: {
            username: user.username,
            role: user.role,
          },
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = userController;
