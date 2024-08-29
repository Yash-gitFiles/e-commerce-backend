const CategoryModel = require("../../models/categoryModels");
const Subcategory = require("../../models/subCategoryModels");

async function createSubCategory(req, res) {
  const { subCategoryName, categoryId } = req.body;

  try {
    const findCategoryByID = await CategoryModel.findById(categoryId);

    if (!findCategoryByID) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    const subCategoryExitsOrNot = await Subcategory.findOne({
      subCategoryName: { $regex: new RegExp(`^${subCategoryName}$`, "i") },
      category: categoryId,
    });

    if (subCategoryExitsOrNot) {
      return res
        .status(400)
        .json({ message: "Subcategory already exists", success: false });
    }

    const subCategory = new Subcategory({
      subCategoryName,
      category: categoryId,
    });
    await subCategory.save();
    await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        $push: { subCategory: subCategory._id },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Subcategory created successfully",
      success: true,
      subCategory,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}

async function showAllSubCategory(_, res) {
  try {
    const allSubCategoryList = await Subcategory.find({}).populate("category");
    return res.status(200).json({
      allSubCategoryList,
      message: "all subcategory received successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
module.exports = {
  createSubCategory,
  showAllSubCategory,
};
