const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String },
    password: { type: String },
    role: { type: String },
  },
  {
    collection: "users",
  },
  {
    timestamps: true,
  },
  { versionKey: false 
  }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
