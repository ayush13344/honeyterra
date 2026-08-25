import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAdminOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================================================
// CUSTOMER ROUTES
// ==================================================

// Create new order
router.post(
  "/",
  protect,
  createOrder
);

// Get logged-in user's orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Get logged-in user's single order
router.get(
  "/:id",
  protect,
  getOrderById
);

// Cancel logged-in user's order
router.patch(
  "/:id/cancel",
  protect,
  cancelOrder
);

// ==================================================
// ADMIN ROUTES
// ==================================================

// Admin gets any order
router.get(
  "/admin/:id",
  protect,
  getAdminOrderById
);

// Admin updates order status
router.patch(
  "/admin/:id/status",
  protect,
  updateOrderStatus
);

export default router;