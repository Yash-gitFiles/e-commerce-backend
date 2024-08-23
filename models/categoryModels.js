const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["Men", "Women", "Kids"],
  },
  subCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
  ],
});

const CategoryModels = mongoose.model("Category", CategorySchema);

module.exports = CategoryModels;
