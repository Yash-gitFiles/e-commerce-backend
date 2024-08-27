const express = require("express");

const {
  getAllUserDetails,
  getUserDelete,
  getUserUpdate,
} = require("../../controller/admin/getAllUserDetailsController");

const router = express.Router();

router.get("/", getAllUserDetails);
router.delete("/:id", getUserDelete);
router.put("/:id", getUserUpdate);

module.exports = router;
