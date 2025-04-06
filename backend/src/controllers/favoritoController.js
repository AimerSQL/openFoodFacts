const express = require('express');
const mongoose = require('mongoose');
const Favorito = require('../models/favoritoModel'); // 引入Favorito模型
const User = require('../models/userModel'); // 引入User模型
const Product = require('../models/productModel'); // 引入Product模型
const favoritoController = {};

const router = express.Router();

// 1. 收藏夹功能 - 添加收藏
favoritoController.collectProductAndUser = async (req, res) => {
  const { product_id,user_id } = req.body;
    
    const favorito = new Favorito({
      _id: new mongoose.Types.ObjectId(),
      product_id,
      user_id,
    });

    // 保存到数据库
    await favorito.save();
    res.status(201).json({ message: 'Product added to favorites', favorito });
};

favoritoController.deleteFavoritoById = async (req, res) => {
  const { user_id,product_id } = req.params;  // 假设请求体包含 userId 和 productId
  try {
    const productId = mongoose.Types.ObjectId(product_id);
    const userId = mongoose.Types.ObjectId(user_id);
    
    const favorito = await Favorito.findOne({ user_id: userId, product_id: productId });
    if (!favorito) {
      console.log('No matching favorito found for the given user and product');
      return res.status(404).send({ error: 'No matching favorito found' });
    }

    // 删除找到的 favorito
    const result = await Favorito.deleteOne({ _id: favorito._id });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Error deleting favorito' });
    }

    res.status(200).send({ message: 'Favorito deleted successfully' });
  } catch (error) {
    console.error('Error deleting favorito:', error);
    res.status(500).send({ error: 'Error deleting favorito' });
  }
};
favoritoController.getFavoritoByUserId= async (req, res) => {
  const { user_id } = req.params;
  try {
    // 1. 查询 Favorito 数据库，找出该用户所有收藏的产品 ID
    const favoritos = await Favorito.find({ user_id }).select('product_id');
    res.json( favoritos );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  } 
};
favoritoController.getProductoByFavorito = async(req,res) =>{
  const { user_id } = req.params;
  try {
      // 1. 查询 Favorito 数据库，找出该用户所有收藏的产品 ID
      const favoritos = await Favorito.find({ user_id }).select('product_id');
      // 2. 提取 product_id 列表
      const productId = favoritos.map(favorito => favorito.product_id);

      // 3. 查询 Product 数据库，获取对应的产品信息
      const products = await Product.find({ '_id': { $in: productId } });

      // 4. 返回查询到的产品信息
      res.json( products );
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = favoritoController;
