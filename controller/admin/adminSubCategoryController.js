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

async function deleteSubCategory(req, res) {
  const { id } = req.params;

  try {
    const subCategory = await Subcategory.findById(id);

    if (!subCategory) {
      return res
        .status(404)
        .json({ message: "Subcategory not found", success: false });
    }

    const category = await CategoryModel.findById(subCategory.category);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }

    category.subCategory = category.subCategory.filter(
      (subCatId) => !subCatId.equals(id)
    );

    await category.save();

    await Subcategory.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Subcategory deleted successfully",
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

async function editSubCategory(req, res) {
  const { id } = req.params;
  const { subCategoryName, category } = req.body;

  try {
    const findSubCategory = await Subcategory.findById(id);

    if (!findSubCategory) {
      return res
        .status(404)
        .json({ message: "Subcategory not found", success: false });
    }

    const subCategoryExistOrNot = await Subcategory.findOne({
      subCategoryName: { $regex: new RegExp(`^${subCategoryName}$`, "i") },
      category,
    });

    if (subCategoryExistOrNot) {
      return res.status(400).json({
        message: "SubCategory already exist",
        success: false,
      });
    }

    let updateSubCategory = {
      subCategoryName,
    };

    updateSubCategory = await Subcategory.findByIdAndUpdate(
      id,
      updateSubCategory,
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "SubCategory updated successfully",
      success: true,
      data: updateSubCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

async function categoryWiseSubcategory(req, res) {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    const subcategories = await Subcategory.find({ category: id });

    return res.status(200).json({
      message: "Category wise subcategory data",
      success: true,
      data: subcategories,
    });
  } catch (error) {
    console.error("Error in categoryWiseSubcategory:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

module.exports = {
  createSubCategory,
  showAllSubCategory,
  deleteSubCategory,
  editSubCategory,
  categoryWiseSubcategory,
};
