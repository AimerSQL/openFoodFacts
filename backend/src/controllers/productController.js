const Product = require("../models/productModel");
const Barcode = require("../models/barcodeModel");
const mongoose = require("mongoose");
const productController = {};
const { ObjectId } = require("mongodb");

productController.getFilteredProducts = async (req, res) => {
  try {
    const { categories, brands, countries, name, nutriScore } = req.body;
    const query = {};
    const andConditions = [];

    if (countries) {
      andConditions.push({
        countries_en: { $regex: new RegExp(countries, "i") },
      });
    }

    if (categories) {
      andConditions.push({
        categories: { $regex: new RegExp(categories, "i") },
      });
    }

    if (brands) {
      andConditions.push({ brands: { $regex: new RegExp(brands, "i") } });
    }

    if (name) {
      andConditions.push({ product_name: { $regex: new RegExp(name, "i") } });
    }

    if (nutriScore) {
      andConditions.push({
        nutriscore_grade: { $regex: new RegExp(nutriScore, "i") },
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const products = await Product.find(query);

    res.json({
      count: products.length,
      products: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const productName = req.query.productName;
    const barcode = await Barcode.findOne({ product_name: productName });
    const id = mongoose.Types.ObjectId(req.params.productId);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const filteredProduct = {
      barcode: barcode.barcode,
      _id: product._id ? product._id : "",
      product_name: product.product_name ? product.product_name : "",
      brand: product.brands ? product.brands : "",
      countries_en: product.countries_en ? product.countries_en : "",
      ingretients_text: product.ingretients_text
        ? product.ingretients_text
        : "",
      image_url: product.image_url ? product.image_url : "",
      categories: product.categories ? product.categories : "",
      energy_100g: product.energy_100g,
      fat_100g: product.fat_100g,
      carbohydrates_100g: product.carbohydrates_100g,
      sugars_100g: product.sugars_100g,
      fiber_100g: product.fiber_100g,
      proteins_100g: product.proteins_100g,
      salt_100g: product.salt_100g,
      sodium_100g: product.sodium_100g,
      nutri_score: product.nutriscore_grade,
    };

    res.json(filteredProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

productController.getProductStatics = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $facet: {
          nutriscoreRatio: [
            {
              $group: {
                _id: "$nutriscore_grade",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            {
              $group: {
                _id: null,
                total: { $sum: "$count" },
                data: {
                  $push: {
                    grade: "$_id",
                    count: "$count",
                  },
                },
              },
            },
            { $unwind: "$data" },
            {
              $project: {
                _id: 0,
                nutriscore_grade: "$data.grade",
                count: "$data.count",
                ratio: { $divide: ["$data.count", "$total"] },
              },
            },
          ],
          categoryRatio: [
            {
              $group: {
                _id: "$countries_en",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            {
              $group: {
                _id: null,
                total: { $sum: "$count" },
                data: {
                  $push: {
                    category: "$_id",
                    count: "$count",
                  },
                },
              },
            },
            { $unwind: "$data" },
            {
              $project: {
                _id: 0,
                category: "$data.category",
                count: "$data.count",
                ratio: { $divide: ["$data.count", "$total"] },
              },
            },
          ],
          brandRatio: [
            {
              $group: {
                _id: "$brands_tags",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            {
              $group: {
                _id: null,
                total: { $sum: "$count" },
                data: {
                  $push: {
                    brand: "$_id",
                    count: "$count",
                  },
                },
              },
            },
            { $unwind: "$data" },
            {
              $project: {
                _id: 0,
                brand: "$data.brand",
                count: "$data.count",
                ratio: { $divide: ["$data.count", "$total"] },
              },
            },
          ],
        },
      },
    ]);

    const statistics = result[0];
    res.status(200).json(statistics);
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Failed to aggregate product statistics" });
  }
};

productController.getProductByBarcode = async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const product = await Barcode.findOne({ barcode: barcode });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productName = product.product_name;

    const foundProduct = await Product.findOne({ product_name: productName });
    console.log("Found product:", foundProduct);
    if (!foundProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const filteredProduct = {
      _id: foundProduct._id ? foundProduct._id : "",
      barcode: barcode,
      product_name: foundProduct.product_name ? foundProduct.product_name : "",
      brand: foundProduct.brands ? foundProduct.brands : "",
      countries_en: foundProduct.countries_en ? foundProduct.countries_en : "",
      ingretients_text: foundProduct.ingretients_text
        ? foundProduct.ingretients_text
        : "",
      image_url: foundProduct.image_url ? foundProduct.image_url : "",
      categories: foundProduct.categories ? foundProduct.categories : "",
      energy_100g: foundProduct.energy_100g,
      fat_100g: foundProduct.fat_100g,
      carbohydrates_100g: foundProduct.carbohydrates_100g,
      sugars_100g: foundProduct.sugars_100g,
      fiber_100g: foundProduct.fiber_100g,
      proteins_100g: foundProduct.proteins_100g,
      salt_100g: foundProduct.salt_100g,
      sodium_100g: foundProduct.sodium_100g,
    };

    res.json(filteredProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

productController.deleteProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const objectId = ObjectId(productId);
    const result = await Product.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ error: "Error deleting product" });
  }
};

productController.addProduct = async (req, res) => {
  try {
    const {
      product_name,
      code,
      brands,
      countries_en,
      energy_100g,
      fat_100g,
      carbohydrates_100g,
      sugars_100g,
      fiber_100g,
      proteins_100g,
      salt_100g,
      sodium_100g,
      image_url,
      categories,
      nutriscore_grade,
    } = req.body;

    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      code,
      product_name,
      brands,
      countries_en,
      energy_100g,
      fat_100g,
      carbohydrates_100g,
      sugars_100g,
      fiber_100g,
      proteins_100g,
      salt_100g,
      sodium_100g,
      image_url,
      categories,
      nutriscore_grade,
    });

    await newProduct.save();

    const newBarcode = new Barcode({
      _id: new mongoose.Types.ObjectId(),
      product_name: product_name,
      barcode: code
    });

    await newBarcode.save();

    res.status(201).json({ message: "Producto guardado exitosamente" });
  } catch (error) {
    console.error("Error al guardar el producto:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = productController;
