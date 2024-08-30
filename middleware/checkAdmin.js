const jwt = require("jsonwebtoken");

function checkAdmin(req, res, next) {
  let headersToken = null;
  if (req.headers.authorization) {
    headersToken = req.headers.authorization.split(" ")[1];
  }

  const token = req.cookies.token || headersToken;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please Provide Token", success: false });
    }

    const decode = jwt.verify(token, process.env.JWT_KEY);

    if (decode.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not an admin", success: false });
    }
    req.user = decode;
    next();
  } catch (error) {
    // console.log("error", error);
    return res.status(500).json({
      message: "Internal Server Error middle ware error",
      success: false,
    });
  }
}

module.exports = {
  checkAdmin,
};
