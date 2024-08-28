const express = require("express");
const {
  createCategory,
  deleteCategory,
  updateCategory,
  allCategory,
} = require("../../controller/admin/getAllCategory");

const router = express.Router();

router.post("/", createCategory);
router.get("/allCategory", allCategory);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategory);

module.exports = router;
