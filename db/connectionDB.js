const mongoose = require("mongoose");

function connectionToDB() {
  console.log("connection DB");
  mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");
}

module.exports = connectionToDB;
