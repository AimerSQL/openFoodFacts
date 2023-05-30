const { Schema, model, default: mongoose } = require('mongoose');

const barcodeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_name: { type: String },
    barcode: { type: String },

}, {
    collection: 'barcodes'
}, {
    timestamps: true
});

module.exports = model('barcodeModel', barcodeSchema);
