const express = require("express");
const {
  createSubCategory,
  showAllSubCategory,
} = require("../../controller/admin/adminSubCategoryController");

const router = express.Router();

router.post("/createSubCategory", createSubCategory);
router.get("/", showAllSubCategory);

module.exports = router;
