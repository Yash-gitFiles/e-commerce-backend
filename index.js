const express = require("express");
const connectionToDB = require("./db/connectionDB");
const commonRoute = require("./routes/commonRoute");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const adminAllUserRoutes = require("./routes/admin/adminAllUserDeatilRoute");
const adminCategoryRoutes = require("./routes/admin/adminCategoryRoutes");
const adminSubCategoryRoutes = require("./routes/admin/adminSubCategoryRoutes");
const adminProducts = require("./routes/admin/adminProducts");

// middle ware
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
const { checkAdmin } = require("./middleware/checkAdmin");

// check admin
app.use("/admin", checkAdmin);
// routes
app.use("/", commonRoute);

app.use("/admin", adminAllUserRoutes);
app.use("/admin/category", adminCategoryRoutes);
app.use("/admin/subCategory", adminSubCategoryRoutes);
app.use("/admin/products", adminProducts);

app.listen(8000, () => {
  connectionToDB();
  console.log("Server is running on port 8000");
});
