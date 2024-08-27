const jwt = require("jsonwebtoken");

function loginOrNot(req, res, next) {
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

    req.user = decode;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}

module.exports = {
  loginOrNot,
};
