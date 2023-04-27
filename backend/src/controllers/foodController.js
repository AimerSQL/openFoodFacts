const foodController = {};
const axios = require('axios');


const productModel = require('../models/productModel')



foodController.getAllFoods = async (req, res) => {
    try {
      const { page = req.body.page, limit = req.body.limit } = req.query;
  
      const count = await productModel.countDocuments();
      const totalPages = Math.ceil(count / limit);
      const skip = (page - 1) * limit;

      const productos = await productModel.find()
        .skip(skip)
        .limit(limit)
        .exec();

      const filteredProductos = productos.map((producto) => ({
        _id: producto._id ? producto._id : "",
        product_name: producto.product_name ? producto.product_name : "",
        brand: producto.brands ? producto.brands : "",
        countries_en: producto.countries_en ? producto.countries_en : "",
        ingretients_text: producto.ingretients_text ? producto.ingretients_text : "",
        image_url: producto.image_url ? producto.image_url : "",
        categories: producto.categories ? producto.categories : "",
      }));

      res.json({
        totalPages: totalPages,
        currentPage: page,
        totalCount: count,
        data: filteredProductos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "error get" });
    }
  };

module.exports = foodController;