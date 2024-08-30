const express = require("express");
const {
  createSubCategory,
  showAllSubCategory,
  deleteSubCategory,
  editSubCategory,
  categoryWiseSubcategory,
} = require("../../controller/admin/adminSubCategoryController");

const router = express.Router();

router.post("/createSubCategory", createSubCategory);
router.get("/", showAllSubCategory);
router.get("/:id", categoryWiseSubcategory);
router.delete("/:id", deleteSubCategory);
router.put("/:id", editSubCategory);

module.exports = router;
