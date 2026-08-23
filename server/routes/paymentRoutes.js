import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// CREATE RAZORPAY PAYMENT ORDER
// ==========================================
router.post(
  "/create-order",
  protect,
  createPaymentOrder
);


// ==========================================
// VERIFY PAYMENT
// ==========================================
router.post(
  "/verify",
  protect,
  verifyPayment
);


export default router;