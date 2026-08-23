import crypto from "crypto";

import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";


// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find Honeyterra order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Don't create another Razorpay order
    // if one already exists
    if (order.razorpayOrderId) {
      return res.status(200).json({
        success: true,
        message: "Payment order already exists",
        razorpayOrderId: order.razorpayOrderId,
        amount: order.totalAmount,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Don't allow payment for cancelled order
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cancelled order cannot be paid",
      });
    }

    // Don't create payment for already paid order
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Razorpay amount is in paise
    const amountInPaise = Math.round(order.totalAmount * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",

      receipt: `honeyterra_${order._id}`,

      notes: {
        honeyterraOrderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Save Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Payment order created successfully",

      razorpayOrderId: razorpayOrder.id,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};


// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !orderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    // Find the actual Honeyterra order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure our server already created
    // the Razorpay order
    if (!order.razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order not found",
      });
    }

    // Already paid
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // ==========================================
    // CREATE SIGNATURE
    // ==========================================

    const body =
      order.razorpayOrderId +
      "|" +
      razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");

    // Timing-safe comparison
    const receivedBuffer = Buffer.from(
      razorpaySignature,
      "utf8"
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "utf8"
    );

    if (
      receivedBuffer.length !==
      expectedBuffer.length
    ) {
      order.paymentStatus = "failed";

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const isValid = crypto.timingSafeEqual(
      receivedBuffer,
      expectedBuffer
    );

    if (!isValid) {
      order.paymentStatus = "failed";

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ==========================================
    // PAYMENT VERIFIED
    // ==========================================

    order.razorpayPaymentId = razorpayPaymentId;

    order.razorpaySignature = razorpaySignature;

    order.paymentStatus = "paid";

    order.orderStatus = "confirmed";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};