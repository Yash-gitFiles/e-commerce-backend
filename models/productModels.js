const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  size: [
    {
      type: String,
      enum: [
        //kids
        "1-2Y",
        "2-3Y",
        "3-4Y",
        "4-5Y",
        "5-6Y",
        "6-7Y",
        "7-8Y",
        "8-9Y",
        "9-10Y",
        // men-women
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "XXXL",
        // bottom
        "28",
        "30",
        "32",
        "34",
        "36",
        "38",
        "40",
        // shoes
        "UK 6",
        "UK 7",
        "UK 8",
        "UK 9",
        "UK 10",
        "UK 11",
      ],
      require: true,
    },
  ],
  img: [
    {
      type: String,
      require: true,
    },
  ],
  desc: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  discount: {
    type: Number,
    require: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
  },
  finalPrice: {
    type: Number,
    require: true,
  },
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
