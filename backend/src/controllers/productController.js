const Product = require('../models/productModel');

const productController = {};

productController.getFilteredProducts = async (req, res) => {
  try {
    const { categories, brand, countries } = req.body;

    console.log(req.body)
    const query = {};

    if (categories) {
      const categoryArray = categories.split(',').map(category => category.trim());
      query.categories = { $in: categoryArray.map(category => new RegExp(category, 'i')) };
    }

    if (brand) {
      query.brands = { $regex: new RegExp(brand, 'i') };
    }

    if (countries) {
      query.countries_en = { $regex: new RegExp(countries, 'i') };
    }

    console.log(query)
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

module.exports = productController;