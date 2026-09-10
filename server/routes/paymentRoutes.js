import express from "express";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

import protect  from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

router.post(
  "/create-order",
  protect,
  createRazorpayOrder
);

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

router.post(
  "/verify",
  protect,
  verifyRazorpayPayment
);

export default router;