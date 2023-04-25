const foodController = {};
const axios = require('axios');


const productModel = require('../models/productModel')



foodController.getAllFoods = async (req, res) => {
    try {
        const productos = await productModel.find().limit(100);
        const filteredProductos = productos.map(producto => {
            return {
                _id: producto._id ? producto._id : "",
                product_name: producto.product_name ? producto.product_name : "",
                brand: producto.brand ? producto.brand : "",
                countries_en: producto.countries_en ? producto.countries_en : "",
                ingretients_text: producto.ingretients_text ? producto.ingretients_text : "",
                image_url: producto.image_url ? producto.image_url : "",
                categories: producto.categories ? producto.categories : ""
            };
        });
        res.json(filteredProductos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'error get' });
    }
}

module.exports = foodController;