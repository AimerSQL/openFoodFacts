const votModel = require('../models/votModel');
const mongoose = require('mongoose');
const rateController = {};

rateController.getProductRate = async (req, res) => {
    let totalProductos = 0;
    let manufacturingLike = 0;
    let packagingLike = 0;
    let palmoilLike = 0;
    let sizeLike = 0;
    let storageLike = 0;
    let transportLike = 0;
    const cod = req.params.id;
    const productos = await axios.get('https://world.openfoodfacts.org/api/v0/product/' + cod + '.json');
    await votModel.find().then(data => {
        data.forEach(element => {
            if (element.vot[cod]["en:manufacturing"] == true) {
                manufacturingLike++;
            }
            if (element.vot[cod]["en:packaging"] == true) {
                packagingLike++;
            }
            if (element.vot[cod]["en:palm-oil"] == true) {
                palmoilLike++;
            }
            if (element.vot[cod]["en:size"] == true) {
                sizeLike++;
            }
            if (element.vot[cod]["en:storage"] == true) {
                storageLike++;
            }
            if (element.vot[cod]["en:transport"] == true) {
                transportLike++;
            }
            totalProductos++;
        });
    });
    console.log(totalProductos)
}

module.exports = rateController;