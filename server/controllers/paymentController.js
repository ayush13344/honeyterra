import Razorpay from "razorpay";
import crypto from "crypto";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ==========================================
// RAZORPAY INSTANCE
// ==========================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // ==========================================
    // VALIDATE SHIPPING ADDRESS
    // ==========================================

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required",
      });
    }

    // ==========================================
    // FIND CART
    // ==========================================

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ==========================================
    // CHECK STOCK
    // ==========================================

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            "One of the products in your cart no longer exists",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock`,
        });
      }
    }

    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const subtotal = Number(cart.totalAmount || 0);

    const FREE_SHIPPING_LIMIT = 999;

    const shipping =
      subtotal >= FREE_SHIPPING_LIMIT
        ? 0
        : 49;

    const total = subtotal + shipping;

    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `HT_${Date.now()}`,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message: "Razorpay order created successfully",

      key: process.env.RAZORPAY_KEY_ID,

      razorpayOrderId: razorpayOrder.id,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      total,

      shipping,
    });
  } catch (error) {
    console.error(
      "Create Razorpay Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,

      fullName,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // ==========================================
    // VALIDATE PAYMENT DATA
    // ==========================================

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is missing",
      });
    }

    // ==========================================
    // CREATE SIGNATURE
    // ==========================================

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpayOrderId}|${razorpayPaymentId}`
      )
      .digest("hex");

    // ==========================================
    // VERIFY SIGNATURE
    // ==========================================

    if (
      generatedSignature !== razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ==========================================
    // FIND CART
    // ==========================================

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (
      !cart.items ||
      cart.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ==========================================
    // CHECK STOCK
    // ==========================================

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            "One of the products in your cart no longer exists",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock`,
        });
      }

      orderItems.push({
        product: product._id,

        name: product.name,

        image:
          product.images &&
          product.images.length > 0
            ? product.images[0]
            : "",

        price: item.price,

        quantity: item.quantity,
      });
    }

    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const subtotal = Number(
      cart.totalAmount || 0
    );

    const FREE_SHIPPING_LIMIT = 999;

    const shipping =
      subtotal >= FREE_SHIPPING_LIMIT
        ? 0
        : 49;

    const total = subtotal + shipping;

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const order = await Order.create({
      user: userId,

      items: orderItems,

      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
      },

      totalAmount: total,

      paymentStatus: "paid",

      orderStatus: "confirmed",

      razorpayOrderId,

      razorpayPaymentId,

      razorpaySignature,
    });

    // ==========================================
    // REDUCE STOCK
    // ==========================================

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    // ==========================================
    // EMPTY CART
    // ==========================================

    cart.items = [];

    cart.totalItems = 0;

    cart.totalAmount = 0;

    await cart.save();

    // ==========================================
    // POPULATE ORDER
    // ==========================================

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.product",
          "name slug images price"
        );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Payment verified and order placed successfully",

      order: populatedOrder,
    });
  } catch (error) {
    console.error(
      "Verify Razorpay Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Payment verification failed",

      error: error.message,
    });
  }
};