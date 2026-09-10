import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

import {
  createShiprocketOrder,
  generateAWB,
  generatePickup,
  generateManifest,
  generateLabel,
  getShipmentTracking,
} from "../config/shiprocket.js";

// ==========================================
// CREATE ORDER
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
        message:
          "Full name, phone, address, city, state and pincode are required",
      });
    }

    // ==========================================
    // FIND USER CART
    // ==========================================

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ==========================================
    // VALIDATE CART PRODUCTS
    // ==========================================

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message:
            "One or more products in your cart are no longer available",
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} has only ${item.product.stock} item(s) left in stock`,
        });
      }
    }

    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    const totalAmount = cart.items.reduce(
      (total, item) => {
        return (
          total +
          Number(item.price) * Number(item.quantity)
        );
      },
      0
    );

    // ==========================================
    // CREATE ORDER ITEMS
    // ==========================================

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image:
        item.product.images?.[0] ||
        item.product.image ||
        "",
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    // ==========================================
    // CREATE MONGODB ORDER
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

      totalAmount,

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
            stock: -Number(item.quantity),
          },
        }
      );
    }

    // ==========================================
    // CLEAR CART
    // ==========================================

    cart.items = [];
    await cart.save();

    // ==========================================
    // CREATE SHIPROCKET ORDER
    // ==========================================

    try {
      const shiprocketResponse =
        await createShiprocketOrder(order);

      console.log(
        "Shiprocket Order Created:",
        shiprocketResponse
      );

      // ==========================================
      // EXTRACT SHIPROCKET ORDER DETAILS
      // ==========================================

      const shiprocketOrderId =
        shiprocketResponse?.order_id ||
        shiprocketResponse?.response?.data?.order_id ||
        null;

      const shiprocketShipmentId =
        shiprocketResponse?.shipment_id ||
        shiprocketResponse?.response?.data?.shipment_id ||
        null;

      const shiprocketStatus =
        shiprocketResponse?.status ||
        shiprocketResponse?.response?.data?.status ||
        null;

      // ==========================================
      // SAVE SHIPROCKET DETAILS
      // ==========================================

      order.shiprocketOrderId =
        shiprocketOrderId
          ? String(shiprocketOrderId)
          : null;

      order.shiprocketShipmentId =
        shiprocketShipmentId
          ? String(shiprocketShipmentId)
          : null;

      order.shiprocketStatus =
        shiprocketStatus
          ? String(shiprocketStatus)
          : null;

      await order.save();
    } catch (shiprocketError) {
      // ==========================================
      // SHIPROCKET FAILURE
      // ==========================================

      console.error(
        "❌ Shiprocket order creation failed:"
      );

      console.error(
        shiprocketError.response?.data ||
          shiprocketError.message
      );

      // MongoDB order remains successfully created.
    }

    // ==========================================
    // POPULATE ORDER
    // ==========================================

    const populatedOrder =
      await Order.findById(order._id).populate(
        "items.product"
      );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Order created successfully",

      order: populatedOrder,

      shiprocket: {
        orderId:
          populatedOrder.shiprocketOrderId,

        shipmentId:
          populatedOrder.shiprocketShipmentId,

        status:
          populatedOrder.shiprocketStatus,
      },
    });
  } catch (error) {
    console.error("❌ Create Order Error:");

    console.error(
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error:
        error.response?.data ||
        error.message,
    });
  }
};

// ==========================================
// GENERATE AWB - ADMIN
// ==========================================

export const generateOrderAWB = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { courierCompanyId } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!courierCompanyId) {
      return res.status(400).json({
        success: false,
        message:
          "Courier company ID is required",
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
    // CHECK SHIPROCKET SHIPMENT
    // ==========================================

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found. Create the Shiprocket order first.",
      });
    }

    // ==========================================
    // PREVENT DUPLICATE AWB
    // ==========================================

    if (order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has already been generated for this order.",
        awbCode:
          order.shiprocketAwbCode,
      });
    }

    // ==========================================
    // GENERATE AWB
    // ==========================================

    const awbResponse =
      await generateAWB(
        order.shiprocketShipmentId,
        courierCompanyId
      );

    console.log(
      "Shiprocket AWB Response:",
      awbResponse
    );

    // ==========================================
    // EXTRACT AWB DETAILS
    // ==========================================

    const awbCode =
      awbResponse?.response?.data?.awb_code ||
      awbResponse?.response?.data?.awb ||
      awbResponse?.data?.awb_code ||
      awbResponse?.data?.awb ||
      awbResponse?.awb_code ||
      awbResponse?.awb ||
      null;

    const courierName =
      awbResponse?.response?.data
        ?.courier_name ||
      awbResponse?.data?.courier_name ||
      awbResponse?.courier_name ||
      null;

    const status =
      awbResponse?.response?.data?.status ||
      awbResponse?.data?.status ||
      awbResponse?.status ||
      null;

    const trackingUrl =
      awbResponse?.response?.data
        ?.tracking_url ||
      awbResponse?.data?.tracking_url ||
      awbResponse?.tracking_url ||
      null;

    // ==========================================
    // SAVE AWB DETAILS
    // ==========================================

    order.shiprocketAwbCode =
      awbCode
        ? String(awbCode)
        : null;

    order.shiprocketCourierName =
      courierName
        ? String(courierName)
        : null;

    order.shiprocketStatus =
      status
        ? String(status)
        : "AWB Generated";

    order.shiprocketTrackingUrl =
      trackingUrl
        ? String(trackingUrl)
        : null;

    await order.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message:
        "AWB generated successfully",

      orderId: order._id,

      shipmentId:
        order.shiprocketShipmentId,

      awbCode:
        order.shiprocketAwbCode,

      courierName:
        order.shiprocketCourierName,

      trackingUrl:
        order.shiprocketTrackingUrl,

      shiprocketStatus:
        order.shiprocketStatus,

      shiprocket:
        awbResponse,
    });
  } catch (error) {
    console.error(
      "❌ Generate AWB Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate AWB",
      error:
        error.response?.data ||
        error.message,
    });
  }
};

// ==========================================
// SCHEDULE PICKUP - ADMIN
// ==========================================

export const scheduleOrderPickup = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
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
    // CHECK SHIPMENT ID
    // ==========================================

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found. Create the Shiprocket order first.",
      });
    }

    // ==========================================
    // CHECK AWB
    // ==========================================

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet. Generate AWB before scheduling pickup.",
      });
    }

    // ==========================================
    // PREVENT DUPLICATE PICKUP
    // ==========================================

    if (order.shiprocketPickupScheduled) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup has already been scheduled for this order.",
      });
    }

    // ==========================================
    // GENERATE PICKUP
    // ==========================================

    const pickupResponse =
      await generatePickup(
        order.shiprocketShipmentId
      );

    console.log(
      "Shiprocket Pickup Response:",
      pickupResponse
    );

    // ==========================================
    // UPDATE ORDER
    // ==========================================

    order.shiprocketPickupScheduled =
      true;

    if (
      order.orderStatus !== "shipped" &&
      order.orderStatus !== "delivered" &&
      order.orderStatus !== "cancelled"
    ) {
      order.orderStatus = "processing";
    }

    if (
      pickupResponse?.response?.data?.status
    ) {
      order.shiprocketStatus =
        String(
          pickupResponse.response.data.status
        );
    } else if (
      pickupResponse?.data?.status
    ) {
      order.shiprocketStatus =
        String(
          pickupResponse.data.status
        );
    } else if (
      pickupResponse?.status
    ) {
      order.shiprocketStatus =
        String(
          pickupResponse.status
        );
    } else {
      order.shiprocketStatus =
        "Pickup Scheduled";
    }

    await order.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Shiprocket pickup scheduled successfully",

      orderId:
        order._id,

      shipmentId:
        order.shiprocketShipmentId,

      awbCode:
        order.shiprocketAwbCode,

      pickupScheduled:
        order.shiprocketPickupScheduled,

      orderStatus:
        order.orderStatus,

      shiprocketStatus:
        order.shiprocketStatus,

      shiprocket:
        pickupResponse,
    });
  } catch (error) {
    console.error(
      "❌ Schedule Pickup Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to schedule Shiprocket pickup",
      error:
        error.response?.data ||
        error.message,
    });
  }
};

// ==========================================
// GENERATE MANIFEST - ADMIN
// ==========================================

export const generateOrderManifest = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
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
    // CHECK SHIPMENT ID
    // ==========================================

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found.",
      });
    }

    // ==========================================
    // CHECK AWB
    // ==========================================

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet. Generate AWB before generating manifest.",
      });
    }

    // ==========================================
    // CHECK PICKUP
    // ==========================================

    if (!order.shiprocketPickupScheduled) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup has not been scheduled yet. Schedule pickup before generating manifest.",
      });
    }

    // ==========================================
    // PREVENT DUPLICATE MANIFEST
    // ==========================================

    if (order.shiprocketManifestId) {
      return res.status(400).json({
        success: false,
        message:
          "Manifest has already been generated for this order.",
        manifestId:
          order.shiprocketManifestId,
        manifestUrl:
          order.shiprocketManifestUrl,
      });
    }

    // ==========================================
    // GENERATE MANIFEST
    // ==========================================

    const manifestResponse =
      await generateManifest(
        order.shiprocketShipmentId
      );

    console.log(
      "Shiprocket Manifest Response:",
      manifestResponse
    );

    // ==========================================
    // EXTRACT MANIFEST DETAILS
    // ==========================================

    const manifestId =
      manifestResponse?.response?.data
        ?.manifest_id ||
      manifestResponse?.response?.data
        ?.manifestId ||
      manifestResponse?.data
        ?.manifest_id ||
      manifestResponse?.data
        ?.manifestId ||
      manifestResponse?.manifest_id ||
      manifestResponse?.manifestId ||
      null;

    const manifestUrl =
      manifestResponse?.response?.data
        ?.manifest_url ||
      manifestResponse?.response?.data
        ?.manifestUrl ||
      manifestResponse?.response?.data
        ?.url ||
      manifestResponse?.data
        ?.manifest_url ||
      manifestResponse?.data
        ?.manifestUrl ||
      manifestResponse?.data?.url ||
      manifestResponse?.manifest_url ||
      manifestResponse?.manifestUrl ||
      manifestResponse?.url ||
      null;

    const status =
      manifestResponse?.response?.data
        ?.status ||
      manifestResponse?.data?.status ||
      manifestResponse?.status ||
      "Manifest Generated";

    // ==========================================
    // SAVE MANIFEST DETAILS
    // ==========================================

    order.shiprocketManifestId =
      manifestId
        ? String(manifestId)
        : null;

    order.shiprocketManifestUrl =
      manifestUrl
        ? String(manifestUrl)
        : null;

    order.shiprocketStatus =
      String(status);

    await order.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Shiprocket manifest generated successfully",

      orderId:
        order._id,

      shipmentId:
        order.shiprocketShipmentId,

      awbCode:
        order.shiprocketAwbCode,

      manifestId:
        order.shiprocketManifestId,

      manifestUrl:
        order.shiprocketManifestUrl,

      shiprocketStatus:
        order.shiprocketStatus,

      shiprocket:
        manifestResponse,
    });
  } catch (error) {
    console.error(
      "❌ Generate Manifest Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate Shiprocket manifest",
      error:
        error.response?.data ||
        error.message,
    });
  }
};

// ==========================================
// GENERATE SHIPPING LABEL - ADMIN
// ==========================================

export const generateOrderLabel = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
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
    // CHECK SHIPMENT
    // ==========================================

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found.",
      });
    }

    // ==========================================
    // CHECK AWB
    // ==========================================

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet. Generate AWB before generating the shipping label.",
      });
    }

    // ==========================================
    // GENERATE LABEL
    // ==========================================

    const labelResponse =
      await generateLabel(
        order.shiprocketShipmentId
      );

    console.log(
      "Shiprocket Label Response:",
      labelResponse
    );

    // ==========================================
    // EXTRACT LABEL URL
    // ==========================================

    const labelUrl =
      labelResponse?.response?.data
        ?.label_url ||
      labelResponse?.response?.data
        ?.labelUrl ||
      labelResponse?.response?.data
        ?.url ||
      labelResponse?.data?.label_url ||
      labelResponse?.data?.labelUrl ||
      labelResponse?.data?.url ||
      labelResponse?.label_url ||
      labelResponse?.labelUrl ||
      labelResponse?.url ||
      null;

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    if (labelUrl) {
      order.shiprocketStatus =
        "Shipping Label Generated";

      await order.save();
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Shipping label generated successfully",

      orderId:
        order._id,

      shipmentId:
        order.shiprocketShipmentId,

      awbCode:
        order.shiprocketAwbCode,

      labelUrl,

      shiprocketStatus:
        order.shiprocketStatus,

      shiprocket:
        labelResponse,
    });
  } catch (error) {
    console.error(
      "❌ Generate Shipping Label Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate shipping label",
      error:
        error.response?.data ||
        error.message,
    });
  }
};

// ==========================================
// GET SHIPMENT TRACKING - ADMIN
// ==========================================
// ==========================================
// GET SHIPMENT TRACKING - USER / ADMIN
// ==========================================

export const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
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
    // CHECK USER OWNERSHIP
    // ==========================================
    // Admin can view any order.
    // Normal users can only view their own order.

    const isAdmin = req.user?.role === "admin";

    if (
      !isAdmin &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view tracking for this order",
      });
    }

    // ==========================================
    // CHECK AWB
    // ==========================================

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet. Generate AWB before tracking the shipment.",
      });
    }

    // ==========================================
    // GET SHIPROCKET TRACKING
    // ==========================================

    const trackingResponse = await getShipmentTracking(
      order.shiprocketAwbCode
    );

    console.log(
      "Shiprocket Tracking Response:",
      trackingResponse
    );

    // ==========================================
    // EXTRACT CURRENT TRACKING STATUS
    // ==========================================

    const trackingStatus =
      trackingResponse?.tracking_data
        ?.shipment_status ||
      trackingResponse?.tracking_data
        ?.shipment_track?.[0]
        ?.current_status ||
      trackingResponse?.data
        ?.tracking_data
        ?.shipment_status ||
      trackingResponse?.data
        ?.tracking_data
        ?.shipment_track?.[0]
        ?.current_status ||
      null;

    // ==========================================
    // UPDATE SHIPROCKET STATUS
    // ==========================================

    if (trackingStatus) {
      order.shiprocketStatus = String(trackingStatus);

      await order.save();
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message:
        "Shipment tracking information fetched successfully",

      orderId: order._id,

      shipmentId:
        order.shiprocketShipmentId,

      awbCode:
        order.shiprocketAwbCode,

      courierName:
        order.shiprocketCourierName,

      trackingUrl:
        order.shiprocketTrackingUrl,

      shiprocketStatus:
        order.shiprocketStatus,

      tracking:
        trackingResponse,
    });
  } catch (error) {
    console.error(
      "❌ Shipment Tracking Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch shipment tracking information",
      error:
        error.response?.data ||
        error.message,
    });
  }
};

// ==========================================
// GET MY ORDERS
// ==========================================

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id,
      })
        .populate(
          "items.product"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "❌ Get My Orders Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch your orders",
      error: error.message,
    });
  }
};

// ==========================================
// GET ORDER BY ID - USER
// ==========================================

export const getOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const order =
      await Order.findById(id)
        .populate(
          "items.product"
        )
        .populate(
          "user",
          "name email"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // USER CAN ONLY VIEW THEIR OWN ORDER
    // ==========================================

    if (
      order.user._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "❌ Get Order Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order",
      error: error.message,
    });
  }
};

// ==========================================
// GET ORDER BY ID - ADMIN
// ==========================================

export const getAdminOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const order =
      await Order.findById(id)
        .populate(
          "items.product"
        )
        .populate(
          "user",
          "name email"
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
      "❌ Get Admin Order Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS - ADMIN
// ==========================================

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { orderStatus } =
      req.body;

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

    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status",
      });
    }

    // ==========================================
    // FIND ORDER
    // ==========================================

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    order.orderStatus =
      orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "❌ Update Order Status Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
      error: error.message,
    });
  }
};

// ==========================================
// CANCEL ORDER - USER
// ==========================================

export const cancelOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // ==========================================
    // FIND ORDER
    // ==========================================

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // CHECK ORDER OWNER
    // ==========================================

    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to cancel this order",
      });
    }

    // ==========================================
    // CHECK CURRENT STATUS
    // ==========================================

    if (
      [
        "shipped",
        "delivered",
        "cancelled",
      ].includes(order.orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled",
      });
    }

    // ==========================================
    // RESTORE PRODUCT STOCK
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

    // ==========================================
    // UPDATE ORDER
    // ==========================================

    order.orderStatus =
      "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(
      "❌ Cancel Order Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to cancel order",
      error: error.message,
    });
  }
};