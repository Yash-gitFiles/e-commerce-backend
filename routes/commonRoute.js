const express = require("express");
const {
  signUp,
  login,
  logout,
  getUserDetails,
} = require("../controller/commonController");
const {
  signUpValidation,
  loginValidation,
} = require("../middleware/commonValidation");
const { loginOrNot } = require("../middleware/loginOrNot");

const router = express.Router();

router.post("/signup", signUpValidation, signUp);
router.post("/login", loginValidation, login);
router.get("/logout", loginOrNot, logout);
router.get("/userDetails", loginOrNot, getUserDetails);

module.exports = router;
