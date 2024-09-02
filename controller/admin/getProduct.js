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
    stock,
  } = req.body;

  try {
    if (
      !productName ||
      !size ||
      !img ||
      !desc ||
      !price ||
      !discount ||
      !category ||
      !subCategory ||
      !finalPrice ||
      !stock
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

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
      stock,
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
      .json({ message: "Internal Server Error", success: false });
  }
}

async function showAllProduct(_, res) {
  try {
    const allProducts = await ProductModel.find({})
      .populate("category")
      .populate("subCategory");
    return res.status(200).json({
      message: "All products fetched successfully",
      success: true,
      data: allProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const subCategory = await Subcategory.findById(product.subCategory);

    if (!subCategory) {
      return res.status(404).json({
        message: "Subcategory not found",
        success: false,
      });
    }

    subCategory.product = subCategory.product.filter(
      (productId) => !productId.equals(id)
    );

    await subCategory.save();

    await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

async function editProduct(req, res) {
  const { id } = req.params;
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
    stock,
  } = req.body;

  try {
    const findProduct = await ProductModel.findById(id);

    if (!findProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    const productExistOrNot = await ProductModel.findOne({
      productName: { $regex: new RegExp(`^${productName}$`, "i") },
      size,
      img,
      desc,
      price,
      discount,
      category,
      subCategory,
      finalPrice,
      stock,
    });

    if (productExistOrNot) {
      return res.status(400).json({
        message: "Product already exist",
        success: false,
      });
    }

    let updateProduct = {
      productName,
      size,
      img,
      desc,
      price,
      discount,
      category,
      subCategory,
      finalPrice,
      stock,
    };

    updateSubCategory = await ProductModel.findByIdAndUpdate(
      id,
      updateProduct,
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "product updated successfully",
      success: true,
      data: updateProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

module.exports = {
  createProduct,
  showAllProduct,
  deleteProduct,
  editProduct,
};
