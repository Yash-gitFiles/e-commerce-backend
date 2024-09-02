const express = require("express");
const {
  createProduct,
  showAllProduct,
  deleteProduct,
  editProduct
} = require("../../controller/admin/getProduct");

const router = express();

router.post("/createProduct", createProduct);
router.get("/", showAllProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", editProduct);

module.exports = router;
