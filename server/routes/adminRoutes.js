import express from "express";

import {
  adminLogin,
  getAdminProfile,
  getAllUsers,
  getUserStats,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();


// ==========================================
// ADMIN LOGIN
// ==========================================

// This MUST come before protect/adminOnly

router.post("/login", adminLogin);


// ==========================================
// PROTECTED ADMIN ROUTES
// ==========================================

router.use(protect);
router.use(adminOnly);


// ==========================================
// ADMIN PROFILE
// ==========================================

router.get(
  "/profile",
  getAdminProfile
);


// ==========================================
// ALL USERS
// ==========================================

router.get(
  "/users",
  getAllUsers
);


// ==========================================
// USER STATISTICS
// ==========================================

router.get(
  "/stats",
  getUserStats
);


export default router;