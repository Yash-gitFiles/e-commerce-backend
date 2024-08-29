const CategoryModel = require("../../models/categoryModels");

async function createCategory(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Category name is required",
      success: false,
    });
  }

  try {
    const categoryExistOrNot = await CategoryModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (categoryExistOrNot) {
      return res.status(400).json({
        message: "Category already exists",
        success: false,
      });
    }

    const newCategory = new CategoryModel({ name });
    await newCategory.save();

    return res.status(200).json({
      message: "Category created successfully",
      success: true,
      newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const checkCategory = await CategoryModel.findById(id);

    if (!checkCategory) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    console.log(checkCategory);

    await CategoryModel.findByIdAndDelete(checkCategory);
    return res.status(200).json({
      message: "Category deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const findCategory = await CategoryModel.findById(id);

    console.log(findCategory);

    if (!findCategory) {
      return res.status(400).json({
        message: "Category not found",
        success: false,
      });
    }

    const categoryExistOrNot = await CategoryModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (categoryExistOrNot) {
      return res.status(400).json({
        message: "Category already exist",
        success: false,
      });
    }

    let updateCategory = {
      name,
    };

    updateCategory = await CategoryModel.findByIdAndUpdate(id, updateCategory, {
      new: true,
    });

    return res.status(200).json({
      message: "Category updated successfully",
      success: true,
      data: updateCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

async function allCategory(_, res) {
  try {
    const allCategory = await CategoryModel.find({});
    return res.status(200).json({
      message: "All categories fetched successfully",
      success: true,
      data: allCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  allCategory,
};
