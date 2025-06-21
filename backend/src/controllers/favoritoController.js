const express = require('express');
const mongoose = require('mongoose');
const Favorito = require('../models/favoritoModel');
const Product = require('../models/productModel');
const favoritoController = {};

favoritoController.collectProductAndUser = async (req, res) => {
  const { product_id,user_id } = req.body;
    
    const favorito = new Favorito({
      _id: new mongoose.Types.ObjectId(),
      product_id,
      user_id,
    });

    await favorito.save();
    res.status(201).json({ message: 'Product added to favorites', favorito });
};

favoritoController.deleteFavoritoById = async (req, res) => {
  const { user_id,product_id } = req.params;
  try {
    const productId = mongoose.Types.ObjectId(product_id);
    const userId = mongoose.Types.ObjectId(user_id);
    
    const favorito = await Favorito.findOne({ user_id: userId, product_id: productId });
    if (!favorito) {
      return res.status(404).send({ error: 'No matching favorito found' });
    }

    const result = await Favorito.deleteOne({ _id: favorito._id });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Error deleting favorito' });
    }

    res.status(200).send({ message: 'Favorito deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error deleting favorito' });
  }
};

favoritoController.getFavoritoByUserId= async (req, res) => {
  const { user_id } = req.params;
  try {
    const favoritos = await Favorito.find({ user_id }).select('product_id');
    res.json( favoritos );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  } 
};

favoritoController.getProductoByFavorito = async(req,res) =>{
  const { user_id } = req.params;
  try {
      const favoritos = await Favorito.find({ user_id }).select('product_id');

      const productId = favoritos.map(favorito => favorito.product_id);

      const products = await Product.find({ '_id': { $in: productId } });

      res.json( products );
      
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = favoritoController;
