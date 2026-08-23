import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ==========================================
// ADMIN LOGIN
// ==========================================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ==========================================
    // CHECK ADMIN EMAIL
    // ==========================================

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("ADMIN_EMAIL is missing in .env");

      return res.status(500).json({
        success: false,
        message: "Admin email is not configured",
      });
    }

    if (
      email.trim().toLowerCase() !==
      adminEmail.trim().toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: "This email is not authorized as admin",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Admin account not found. Create this account first.",
      });
    }

    // ==========================================
    // CHECK ROLE
    // ==========================================

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "This account does not have admin access",
      });
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin password",
      });
    }

    // ==========================================
    // CREATE ADMIN TOKEN
    // ==========================================

    const token = jwt.sign(
      {
        id: user._id,
        _id: user._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Admin login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login",
    });
  }
};


// ==========================================
// GET ADMIN PROFILE
// ==========================================

const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Admin Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};


// ==========================================
// GET USER COUNT
// ==========================================

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      isActive: true,
    });

    const inactiveUsers = await User.countDocuments({
      isActive: false,
    });

    const admins = await User.countDocuments({
      role: "admin",
    });

    const normalUsers = await User.countDocuments({
      role: "user",
    });

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        admins,
        normalUsers,
      },
    });
  } catch (error) {
    console.error("User Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

export {
  adminLogin,
  getAdminProfile,
  getAllUsers,
  getUserStats,
};