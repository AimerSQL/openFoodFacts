const foodController = {};
const axios = require('axios');


const votModel = require('../models/votModel');
foodController.getFoods = async (req, res) => {
    const data = [];
    let totalProductos = 0;
    let manufacturingLike = 0;
    let packagingLike = 0;
    let palmoilLike = 0;
    let sizeLike = 0;
    let storageLike = 0;
    let transportLike = 0;
    const cod = (req.params.id).replace(/,/g,'');
    const productos = await axios.get('https://world.openfoodfacts.org/api/v0/product/' + cod + '.json');
    /* await votModel.find().then(data => {
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
    }); */

    data.push({
        id: req.params.id,
        img: productos["data"]["product"]["selected_images"]["front"]["display"]["fr"],
        product_name: productos["data"]["product"]["product_name"],
        categories: productos["data"]["product"]["categories"],
        brand: productos["data"]["product"]["brands"],
        etiquetas: productos["data"]["product"]["labels_old"],
        country: productos["data"]["product"]["countries"],
        /* manufacturing: Math.round((manufacturingLike / totalProductos) * 100),
        packaging: Math.round((packagingLike / totalProductos) * 100),
        palmoil: Math.round((palmoilLike / totalProductos) * 100),
        size: Math.round((sizeLike / totalProductos) * 100),
        storage: Math.round((storageLike / totalProductos) * 100),
        transport: Math.round((transportLike / totalProductos) * 100) */
    });

    res.json(data);
}
foodController.getAllFoods = async (req, res) => {
    const data = [];
    const producto = await votModel.find();
    const cod = Object.keys(producto[0].vot);
    for (let i = 0; i < cod.length; i++) {
        await axios.get('https://world.openfoodfacts.org/api/v0/product/' + cod[i] + '.json').then(productos => {
            data.push({
                id: cod[i] + ',',
                img: productos["data"]["product"]["selected_images"]["front"]["display"]["fr"],
                product_name: productos["data"]["product"]["product_name"],
                categories: productos["data"]["product"]["categories"],
                brand: productos["data"]["product"]["brands"],
                etiquetas: productos["data"]["product"]["labels_old"],
                country: productos["data"]["product"]["countries"],
            })
        })
    }
    res.json(data);
}

module.exports = foodController;