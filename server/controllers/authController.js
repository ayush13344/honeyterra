import User from "../models/User.js";

import generateToken from "../utils/generateToken.js";

import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";

// ==========================================
// GOOGLE CLIENT
// ==========================================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "User with this email already exists",
      });
    }

    // ==========================================
    // CHECK ADMIN EMAIL
    // ==========================================

    const adminEmail = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    const isAdmin =
      adminEmail &&
      normalizedEmail === adminEmail;

    // ==========================================
    // CREATE USER
    // ==========================================

    const user = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      password,

      phone: phone?.trim() || "",

      role: isAdmin ? "admin" : "user",

      authProvider: "local",
    });

    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    const token = generateToken(user._id);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message: isAdmin
        ? "Admin account created successfully"
        : "Account created successfully",

      token,

      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    // Duplicate email protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "User with this email already exists",
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(
        error.errors
      ).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration",
    });
  }
};

// ==========================================
// LOGIN USER / ADMIN
// ==========================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

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
        message:
          "Invalid email or password",
      });
    }

    // ==========================================
    // CHECK ACTIVE STATUS
    // ==========================================

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated",
      });
    }

    // ==========================================
    // GOOGLE ACCOUNT CHECK
    // ==========================================

    if (
      user.authProvider === "google" &&
      !user.password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    const isPasswordCorrect =
      await user.comparePassword(
        password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // ==========================================
    // DETERMINE ROLE
    // ==========================================

    let role = user.role || "user";

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    // If logged-in email matches ADMIN_EMAIL,
    // make sure user is admin.

    if (
      adminEmail &&
      normalizedEmail === adminEmail
    ) {
      role = "admin";

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
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login",
    });
  }
};

// ==========================================
// GOOGLE LOGIN
// ==========================================

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!credential) {
      return res.status(400).json({
        success: false,
        message:
          "Google credential is required",
      });
    }

    // ==========================================
    // CHECK GOOGLE CLIENT ID
    // ==========================================

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error(
        "GOOGLE_CLIENT_ID is missing"
      );

      return res.status(500).json({
        success: false,
        message:
          "Google authentication is not configured",
      });
    }

    // ==========================================
    // VERIFY GOOGLE ID TOKEN
    // ==========================================

    const ticket =
      await googleClient.verifyIdToken({
        idToken: credential,

        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload =
      ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid Google credential",
      });
    }

    // ==========================================
    // GET GOOGLE USER DATA
    // ==========================================

    const {
      sub: googleId,
      email,
      email_verified,
      name,
      picture,
    } = payload;

    // ==========================================
    // VALIDATE GOOGLE ACCOUNT
    // ==========================================

    if (
      !googleId ||
      !email ||
      !email_verified
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Google account could not be verified",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // ==========================================
    // CHECK ADMIN EMAIL
    // ==========================================

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    const isAdmin =
      adminEmail &&
      normalizedEmail === adminEmail;

    // ==========================================
    // FIND USER BY GOOGLE ID
    // ==========================================

    let user = await User.findOne({
      googleId,
    });

    // ==========================================
    // IF NOT FOUND, CHECK EMAIL
    // ==========================================

    if (!user) {
      user = await User.findOne({
        email: normalizedEmail,
      });
    }

    // ==========================================
    // EXISTING USER
    // ==========================================

    if (user) {
      // ------------------------------------------
      // CHECK ACTIVE STATUS
      // ------------------------------------------

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been deactivated",
        });
      }

      // ------------------------------------------
      // LINK GOOGLE ACCOUNT
      // ------------------------------------------

      user.googleId = googleId;

      user.authProvider = "google";

      if (picture) {
        user.avatar = picture;
      }

      // ------------------------------------------
      // UPDATE NAME IF EMPTY
      // ------------------------------------------

      if (
        !user.name &&
        name
      ) {
        user.name = name;
      }

      // ------------------------------------------
      // ADMIN ROLE
      // ------------------------------------------

      if (isAdmin) {
        user.role = "admin";
      }

      await user.save();
    }

    // ==========================================
    // CREATE NEW GOOGLE USER
    // ==========================================

    else {
      user = await User.create({
        name:
          name?.trim() ||
          "HoneyTerra User",

        email:
          normalizedEmail,

        googleId,

        authProvider: "google",

        avatar: picture || "",

        phone: "",

        role:
          isAdmin
            ? "admin"
            : "user",

        isActive: true,
      });
    }

    // ==========================================
    // DETERMINE FINAL ROLE
    // ==========================================

    const role =
      user.role || "user";

    // ==========================================
    // GENERATE HONEYTERRA JWT
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
          ? "Google admin login successful"
          : "Google login successful",

      token,

      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error(
      "Google Login Error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Google authentication failed",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get Me Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

export {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
};