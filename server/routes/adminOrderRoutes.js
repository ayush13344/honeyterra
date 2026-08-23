import express from "express";

import {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/adminOrderController.js";

import protect  from "../middleware/authMiddleware.js";
import  adminOnly  from "../middleware/adminMiddleware.js";

const router = express.Router();


// ==========================================
// GET ALL ORDERS
// ==========================================
router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);


// ==========================================
// GET SINGLE ORDER
// ==========================================
router.get(
  "/:id",
  protect,
  adminOnly,
  getAdminOrderById
);


// ==========================================
// UPDATE ORDER STATUS
// ==========================================
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);


// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
router.patch(
  "/:id/payment-status",
  protect,
  adminOnly,
  updatePaymentStatus
);


export default router;