import express from "express";

import {
  getDashboardStats,
} from "../controllers/adminDashboardController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getDashboardStats
);

export default router;