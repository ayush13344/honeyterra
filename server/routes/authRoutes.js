import express from "express";

import {
  registerUser,
  loginUser,
  googleLogin,
  getMe,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// REGISTER
// ==========================================

router.post(
  "/register",
  registerUser
);

// ==========================================
// NORMAL LOGIN
// ==========================================

router.post(
  "/login",
  loginUser
);

// ==========================================
// GOOGLE LOGIN
// ==========================================

router.post(
  "/google",
  googleLogin
);

// ==========================================
// CURRENT USER
// ==========================================

router.get(
  "/me",
  protect,
  getMe
);

export default router;