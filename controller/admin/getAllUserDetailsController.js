const User = require("../../models/userModels");
const bcrypt = require("bcryptjs");

async function getAllUserDetails(_, res) {
  try {
    const users = await User.find();
    if (!users) {
      return res
        .status(404)
        .json({ message: "No users found", success: false });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", success: false });
  }
}

// async function getAllUserDetails(req, res) {
//   try {
//     const loggedInUser = req.user;

//     console.log(loggedInUser);

//     if (!loggedInUser) {
//       return res.status(401).json({ message: "Unauthorized", success: false });
//     }

//     let users;
//     if (loggedInUser.role !== "admin") {
//       users = await User.find();
//     } else {
//       users = await User.find({ role: { $ne: "admin" } });
//     }

//     res.status(200).json({
//       message: "Users retrieved successfully",
//       users,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error retrieving users", success: false });
//   }
// }

async function getUserDelete(req, res) {
  const id = req.params.id;

  try {
    const checkUserOrNot = await User.findById(id);

    if (!checkUserOrNot) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "user deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", success: false });
  }
}

async function getUserUpdate(req, res) {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "User not found" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }
    if (role) updates.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({
      error: false,
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
    });
  }
}

module.exports = {
  getAllUserDetails,
  getUserDelete,
  getUserUpdate,
};
