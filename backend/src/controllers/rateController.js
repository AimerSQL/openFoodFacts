const votModel = require('../models/votModel');
const rateController = {};

rateController.getProductRate = async (req, res) => {
    let totalProductos = 0;
    let manufacturingLike = 0;
    let packagingLike = 0;
    let palmoilLike = 0;
    let sizeLike = 0;
    let storageLike = 0;
    let transportLike = 0;
    const cod = req.params.productId;
    await votModel.find().then(data => {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.vot && element.vot[cod]) {
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
            } else {
                totalProductos = data.length;
                const maxRandomRating = Math.min(totalProductos, data.length);
                manufacturingLike = Math.floor(Math.random() * maxRandomRating);
                packagingLike = Math.floor(Math.random() * maxRandomRating);
                palmoilLike = Math.floor(Math.random() * maxRandomRating);
                sizeLike = Math.floor(Math.random() * maxRandomRating);
                storageLike = Math.floor(Math.random() * maxRandomRating);
                transportLike = Math.floor(Math.random() * maxRandomRating);
            }
        }
    });

    const maxRating = 5;
    const minRating = 0;
    
    function safeRound(val, total) {
    if (!total || total === 0) return 0;
        return Math.round((val / total) * (maxRating - minRating) + minRating);
    }

    manufacturingLike = safeRound(manufacturingLike, totalProductos);
    packagingLike = safeRound(packagingLike, totalProductos);
    palmoilLike = safeRound(palmoilLike, totalProductos);
    sizeLike = safeRound(sizeLike, totalProductos);
    storageLike = safeRound(storageLike, totalProductos);
    transportLike = safeRound(transportLike, totalProductos);


    const response = {
        manufacturingLike: manufacturingLike,
        packagingLike: packagingLike,
        palmoilLike: palmoilLike,
        sizeLike: sizeLike,
        storageLike: storageLike,
        transportLike: transportLike
    };

    res.send(response);
}

module.exports = rateController;
