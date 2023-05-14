const { Schema, model, default: mongoose } = require('mongoose');

const productSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    product_name: { type: String },
    brands: { type: String },
    countries_en: { type: String },
    energy_100g: { type: Number },
    fat_100g: { type: Number },
    carbohydrates_100g: { type: Number },
    sugars_100g: { type: Number },
    fiber_100g: { type: Number },
    proteins_100g: { type: Number },
    salt_100g: { type: Number },
    sodium_100g: { type: Number },
    image_url: { type: String },
    categories: [{ type: String }],


}, {
    collection: 'productos'
}, {
    timestamps: true
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
