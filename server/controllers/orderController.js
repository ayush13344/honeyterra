import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ==========================================
// CREATE ORDER - CUSTOMER
// ==========================================

export const createOrder = async (req, res) => {
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
    // FIND USER CART
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
    // CHECK STOCK + PREPARE ORDER ITEMS
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
          product.images && product.images.length > 0
            ? product.images[0]
            : "",

        price: item.price,

        quantity: item.quantity,
      });
    }

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

      totalAmount: cart.totalAmount,

      paymentStatus: "pending",

      orderStatus: "pending",
    });

    // ==========================================
    // REDUCE PRODUCT STOCK
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

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate(
        "items.product",
        "name slug images price"
      );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message: "Order placed successfully",

      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to create order",

      error: error.message,
    });
  }
};

// ==========================================
// GET MY ORDERS - CUSTOMER
// ==========================================

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate(
        "items.product",
        "name slug images price"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      count: orders.length,

      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch orders",

      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE ORDER - CUSTOMER
// ==========================================

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,

      user: req.user._id,
    })
      .populate(
        "user",
        "name email"
      )
      .populate(
        "items.product",
        "name slug images price"
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch order",

      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - GET SINGLE ORDER
// ==========================================

export const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // CHECK ADMIN
    // ==========================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,

        message: "Admin access required",
      });
    }

    // ==========================================
    // FIND ORDER
    // ==========================================

    const order = await Order.findById(id)
      .populate(
        "user",
        "name email"
      )
      .populate(
        "items.product",
        "name slug images price"
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    console.error(
      "Admin Get Order Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: "Failed to fetch order",

      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { orderStatus } = req.body;

    // ==========================================
    // CHECK ADMIN
    // ==========================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,

        message: "Admin access required",
      });
    }

    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!orderStatus) {
      return res.status(400).json({
        success: false,

        message: "Order status is required",
      });
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,

        message: "Invalid order status",
      });
    }

    // ==========================================
    // FIND ORDER
    // ==========================================

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    // ==========================================
    // PREVENT UPDATE AFTER DELIVERY
    // ==========================================

    if (
      order.orderStatus === "delivered" &&
      orderStatus !== "delivered"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "A delivered order cannot be moved to another status",
      });
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    order.orderStatus = orderStatus;

    // ==========================================
    // OPTIONAL PAYMENT STATUS UPDATE
    // ==========================================

    if (
      orderStatus === "confirmed" &&
      order.paymentStatus === "pending"
    ) {
      // For COD, payment remains pending.
      // So we do NOT mark it paid automatically.
    }

    await order.save();

    // ==========================================
    // POPULATE UPDATED ORDER
    // ==========================================

    const updatedOrder = await Order.findById(order._id)
      .populate(
        "user",
        "name email"
      )
      .populate(
        "items.product",
        "name slug images price"
      );

    return res.status(200).json({
      success: true,

      message: "Order status updated successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message: "Failed to update order status",

      error: error.message,
    });
  }
};

// ==========================================
// CANCEL ORDER - CUSTOMER
// ==========================================

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,

      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order not found",
      });
    }

    // ==========================================
    // CHECK CANCELLATION STATUS
    // ==========================================

    if (
      order.orderStatus === "shipped" ||
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "This order cannot be cancelled",
      });
    }

    // ==========================================
    // CANCEL ORDER
    // ==========================================

    order.orderStatus = "cancelled";

    await order.save();

    // ==========================================
    // RESTORE STOCK
    // ==========================================

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        }
      );
    }

    return res.status(200).json({
      success: true,

      message:
        "Order cancelled successfully",

      order,
    });
  } catch (error) {
    console.error(
      "Cancel Order Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to cancel order",

      error: error.message,
    });
  }
};