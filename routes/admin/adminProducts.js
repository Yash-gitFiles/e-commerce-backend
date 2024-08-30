const express = require("express");
const { createProduct } = require("../../controller/admin/getProduct");

const router = express();

router.post("/createProduct", createProduct);

module.exports = router;
