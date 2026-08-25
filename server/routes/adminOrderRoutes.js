import express from "express";

import {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/adminOrderController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// GET ALL ORDERS
// GET /api/admin/orders
// ==========================================

router.get("/", protect, adminOnly, getAllOrders);

// ==========================================
// GET SINGLE ORDER
// GET /api/admin/orders/:id
// ==========================================

router.get("/:id", protect, adminOnly, getAdminOrderById);

// ==========================================
// UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id/status
// ==========================================

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

// ==========================================
// UPDATE PAYMENT STATUS
// PATCH /api/admin/orders/:id/payment-status
// ==========================================

router.patch(
  "/:id/payment-status",
  protect,
  adminOnly,
  updatePaymentStatus
);

export default router;