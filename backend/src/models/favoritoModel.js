const { Schema, model, default: mongoose } = require("mongoose");

const favoritoSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    user_id: { type: mongoose.Schema.Types.ObjectId },
    product_id: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    collection: "favoritos",
  },
  {
    timestamps: true,
  },
  { versionKey: false 
  }
);
const Favorito = mongoose.model("Favorito", favoritoSchema);

module.exports = Favorito;