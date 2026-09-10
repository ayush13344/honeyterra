import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrderById,
  updateOrderStatus,
  cancelOrder,
  generateOrderAWB,
  scheduleOrderPickup,
  generateOrderManifest,
  generateOrderLabel,
  getOrderTracking,
} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE ORDER
// ==========================================

router.post(
  "/",
  protect,
  createOrder
);

// ==========================================
// GET MY ORDERS
// IMPORTANT: THIS MUST COME BEFORE /:id
// ==========================================

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// ==========================================
// GET MY ORDERS - /my
// Keep this too if your frontend uses /my
// ==========================================

router.get(
  "/my",
  protect,
  getMyOrders
);

// ==========================================
// ADMIN - GET ORDER BY ID
// ==========================================

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminOrderById
);

// ==========================================
// ADMIN - GENERATE AWB
// ==========================================

router.post(
  "/admin/:id/generate-awb",
  protect,
  adminOnly,
  generateOrderAWB
);

// ==========================================
// ADMIN - SCHEDULE PICKUP
// ==========================================

router.post(
  "/admin/:id/schedule-pickup",
  protect,
  adminOnly,
  scheduleOrderPickup
);

// ==========================================
// ADMIN - GENERATE MANIFEST
// ==========================================

router.post(
  "/admin/:id/generate-manifest",
  protect,
  adminOnly,
  generateOrderManifest
);

// ==========================================
// ADMIN - GENERATE SHIPPING LABEL
// ==========================================

router.post(
  "/admin/:id/generate-label",
  protect,
  adminOnly,
  generateOrderLabel
);

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

// ==========================================
// ADMIN - TRACK SHIPMENT
// ==========================================

router.get(
  "/admin/:id/tracking",
  protect,
  adminOnly,
  getOrderTracking
);

// ==========================================
// USER - TRACK SHIPMENT
// ==========================================

router.get(
  "/:id/tracking",
  protect,
  getOrderTracking
);

// ==========================================
// USER - GET ORDER BY ID
// IMPORTANT: KEEP THIS NEAR THE END
// ==========================================

router.get(
  "/:id",
  protect,
  getOrderById
);

// ==========================================
// USER - CANCEL ORDER
// ==========================================

router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

export default router;