const { Schema, model, default: mongoose } = require('mongoose');

const productSchema = new Schema({
    _id: { type: String },
    product_name: { type: String },
    brand: { type: String },
    countries_en: { type: String },
    ingretients_text: { type: String },
    image_url: { type: String },
    categories: [{ type: String }],


}, {
    collection: 'productos'
}, {
    timestamps: true
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
