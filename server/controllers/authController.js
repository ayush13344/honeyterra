import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// ==========================================
// REGISTER USER
// ==========================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if this is the admin email
    const isAdmin =
      normalizedEmail ===
      process.env.ADMIN_EMAIL.toLowerCase().trim();

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: isAdmin ? "admin" : "user",
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: isAdmin
        ? "Admin account created successfully"
        : "Account created successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================
// ==========================================
// LOGIN USER / ADMIN
// ==========================================

const loginUser = async (req, res) => {
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

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
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
        message: "Invalid email or password",
      });
    }

    // ==========================================
    // DETERMINE ROLE
    // ==========================================

    let role = "user";

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    if (
      adminEmail &&
      normalizedEmail === adminEmail
    ) {
      role = "admin";

      // ========================================
      // MAKE SURE ADMIN USER HAS ADMIN ROLE
      // ========================================

      if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
    }

    // ==========================================
    // CREATE TOKEN
    // ==========================================

    const token = jwt.sign(
      {
        id: user._id,
        _id: user._id,
        role,
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
      message:
        role === "admin"
          ? "Admin login successful"
          : "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export {
  registerUser,
  loginUser,
  getMe,
};