const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
