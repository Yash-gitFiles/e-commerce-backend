const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
  const { name, email, password } = req.body;

  try {
    const userExitsOrNot = await User.findOne({ email });

    if (userExitsOrNot) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const roleCount = await User.countDocuments({});
    const role = roleCount === 0 ? "admin" : "user";

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      userImage:
        "https://images.unsplash.com/photo-1719937206098-236a481a2b6d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    });

    newUser.save();

    return res.status(200).json({
      message: "User signUp successfully",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        message: "Invalid Password",
        success: false,
      });
    }

    const userData = {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user._id,
      userImage: user.userImage,
    };

    const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "1d" });

    const tokenOption = {
      httpOnly: true,
    };

    return res.cookie("token", token, tokenOption).status(200).json({
      message: "Login successful",
      success: true,
      data: { userData, token },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
}

async function logout(_, res) {
  console.log("res");
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
}

async function getUserDetails(req, res) {
  const userId = req.user.id;
  try {
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      data: findUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
}

async function updateUser(req, res) {
  const userId = req.user.id;

  try {
    const { name, email, password } = req.body;
    const findUser = await User.findById(userId);

    if (email) {
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        return res.status(300).json({
          message: "User already exits",
          success: false,
        });
      }
    }

    if (!findUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const updateUser = {
      name: name || findUser.name,
      email: email || findUser.email,
      password: hashPassword || findUser.password,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

module.exports = {
  signUp,
  login,
  logout,
  getUserDetails,
  updateUser,
};
