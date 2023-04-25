const Product = require('../models/productModel');
const mongoose = require('mongoose');
const productController = {};

productController.getFilteredProducts = async (req, res) => {
  try {
    const { categories, brands, countries } = req.body;

    const query = {};
    const andConditions = [];

    if (categories) {
      andConditions.push({ categories: { $regex: new RegExp(categories, 'i') } });
    }
    
    if (brands) {
      andConditions.push({ brands: { $regex: new RegExp(brands, 'i') } });
    }
    
    if (countries) {
      andConditions.push({ countries: { $regex: new RegExp(countries, 'i') } });
    }
    
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const products = await Product.find(query);

    res.json({
      count: products.length, // 添加 count 属性
      products: products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


productController.getProductById = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.productId);
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}

module.exports = productController;