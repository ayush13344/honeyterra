import express from "express";

import {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,

  createAdminShiprocketOrder,
  generateOrderAWB,
  scheduleOrderPickup,
  generateOrderManifest,
  generateOrderLabel,
  getOrderTracking,
} from "../controllers/adminOrderController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

router.use(protect);
router.use(adminOnly);

// ==========================================
// GET ALL ORDERS
// GET /api/admin/orders
// ==========================================

router.get("/", getAllOrders);

// ==========================================
// CREATE SHIPROCKET ORDER
// POST /api/admin/orders/:id/shiprocket
// ==========================================

router.post(
  "/:id/shiprocket",
  createAdminShiprocketOrder
);

// ==========================================
// GENERATE AWB
// POST /api/admin/orders/:id/awb
// ==========================================

router.post(
  "/:id/awb",
  generateOrderAWB
);

// ==========================================
// SCHEDULE PICKUP
// POST /api/admin/orders/:id/pickup
// ==========================================

router.post(
  "/:id/pickup",
  scheduleOrderPickup
);

// ==========================================
// GENERATE MANIFEST
// POST /api/admin/orders/:id/manifest
// ==========================================

router.post(
  "/:id/manifest",
  generateOrderManifest
);

// ==========================================
// GENERATE SHIPPING LABEL
// POST /api/admin/orders/:id/label
// ==========================================

router.post(
  "/:id/label",
  generateOrderLabel
);

// ==========================================
// GET SHIPMENT TRACKING
// GET /api/admin/orders/:id/tracking
// ==========================================

router.get(
  "/:id/tracking",
  getOrderTracking
);

// ==========================================
// GET SINGLE ORDER
// GET /api/admin/orders/:id
// ==========================================

router.get(
  "/:id",
  getAdminOrderById
);

// ==========================================
// UPDATE ORDER STATUS
// PUT /api/admin/orders/:id/status
// ==========================================

router.put(
  "/:id/status",
  updateOrderStatus
);

// ==========================================
// UPDATE PAYMENT STATUS
// PUT /api/admin/orders/:id/payment-status
// ==========================================

router.put(
  "/:id/payment-status",
  updatePaymentStatus
);

export default router;