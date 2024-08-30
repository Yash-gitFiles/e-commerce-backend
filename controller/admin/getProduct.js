const CategoryModel = require("../../models/categoryModels");
const ProductModel = require("../../models/productModels");
const Subcategory = require("../../models/subCategoryModels");

async function createProduct(req, res) {
  const {
    productName,
    size,
    img,
    desc,
    price,
    discount,
    category,
    subCategory,
    finalPrice,
  } = req.body;

  try {
    const findCategoryByID = await CategoryModel.findById(category);

    if (!findCategoryByID) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    const findSubCategoryByID = await Subcategory.findById(subCategory);

    if (!findSubCategoryByID) {
      return res
        .status(404)
        .json({ message: "Sub Category not found", success: false });
    }

    const name = await ProductModel.findOne({
      productName: { $regex: new RegExp(`^${productName}$`, "i") },
      subCategory: subCategory,
    });

    if (name) {
      return res
        .status(400)
        .json({ message: "Product already exists", success: false });
    }

    const product = new ProductModel({
      productName,
      size,
      img,
      desc,
      price,
      discount,
      category: findCategoryByID,
      subCategory: findSubCategoryByID,
      finalPrice,
    });

    await product.save();

    const updatedSubCategory = await Subcategory.findByIdAndUpdate(
      subCategory,
      {
        $push: { product: product._id },
      },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({
        message: "Subcategory update failed",
        success: false,
      });
    }

    return res.status(200).json({
      message: "product created successfully",
      success: true,
      product,
      updatedSubCategory,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error 12", success: false });
  }
}

module.exports = {
  createProduct,
};
