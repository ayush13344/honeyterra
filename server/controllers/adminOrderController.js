import Order from "../models/Order.js";

import {
  createShiprocketOrder,
  generateAWB,
  generatePickup,
  generateManifest,
  generateLabel,
  getShipmentTracking,
} from "../config/shiprocket.js";

// ==========================================
// GET ALL ORDERS - ADMIN
// ==========================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE ORDER - ADMIN
// ==========================================

export const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("items.product")
      .populate("user", "name email");

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
    console.error("❌ Get Admin Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS - ADMIN
// ==========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PAYMENT STATUS - ADMIN
// ==========================================

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Update Payment Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE SHIPROCKET ORDER - ADMIN
// =====================================================

export const createAdminShiprocketOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ------------------------------------------
    // PREVENT DUPLICATE SHIPROCKET ORDER
    // ------------------------------------------

    if (order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message: "Shiprocket order has already been created",
        shipmentId: order.shiprocketShipmentId,
        shiprocketOrderId: order.shiprocketOrderId,
      });
    }

    // ------------------------------------------
    // CREATE SHIPROCKET ORDER
    // ------------------------------------------

    const shiprocketResponse =
      await createShiprocketOrder(order);

    console.log(
      "🚚 Admin Shiprocket Order Response:",
      shiprocketResponse
    );

    // ------------------------------------------
    // EXTRACT SHIPROCKET ORDER ID
    // ------------------------------------------

    const shiprocketOrderId =
      shiprocketResponse?.order_id ||
      shiprocketResponse?.response?.data?.order_id ||
      shiprocketResponse?.data?.order_id ||
      null;

    // ------------------------------------------
    // EXTRACT SHIPMENT ID
    // ------------------------------------------

    const shiprocketShipmentId =
      shiprocketResponse?.shipment_id ||
      shiprocketResponse?.response?.data?.shipment_id ||
      shiprocketResponse?.data?.shipment_id ||
      null;

    // ------------------------------------------
    // EXTRACT STATUS
    // ------------------------------------------

    const shiprocketStatus =
      shiprocketResponse?.status ||
      shiprocketResponse?.response?.data?.status ||
      shiprocketResponse?.data?.status ||
      "Shipment Created";

    if (!shiprocketShipmentId) {
      console.error(
        "❌ Shiprocket response did not contain shipment_id:",
        shiprocketResponse
      );

      return res.status(500).json({
        success: false,
        message:
          "Shiprocket order was created but shipment ID was not returned",
        shiprocket: shiprocketResponse,
      });
    }

    // ------------------------------------------
    // SAVE SHIPROCKET DETAILS
    // ------------------------------------------

    order.shiprocketOrderId = String(shiprocketOrderId);

    order.shiprocketShipmentId =
      String(shiprocketShipmentId);

    order.shiprocketStatus =
      String(shiprocketStatus);

    await order.save();

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Shiprocket order created successfully",

      orderId: order._id,

      shiprocketOrderId:
        order.shiprocketOrderId,

      shipmentId:
        order.shiprocketShipmentId,

      shiprocketStatus:
        order.shiprocketStatus,

      shiprocket:
        shiprocketResponse,
    });
  } catch (error) {
    console.error(
      "❌ Admin Shiprocket Order Creation Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create Shiprocket order",

      error:
        error.response?.data ||
        error.message,
    });
  }
};

// =====================================================
// GENERATE AWB - ADMIN
// =====================================================

export const generateOrderAWB = async (req, res) => {
  try {
    const { id } = req.params;
    const { courierCompanyId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!courierCompanyId) {
      return res.status(400).json({
        success: false,
        message: "Courier company ID is required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found. Create the Shiprocket order first.",
      });
    }

    if (order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has already been generated for this order.",
        awbCode: order.shiprocketAwbCode,
      });
    }

    const awbResponse = await generateAWB(
      order.shiprocketShipmentId,
      courierCompanyId
    );

    console.log(
      "🚚 Shiprocket AWB Response:",
      awbResponse
    );

    const awbCode =
      awbResponse?.response?.data?.awb_code ||
      awbResponse?.response?.data?.awb ||
      awbResponse?.data?.awb_code ||
      awbResponse?.data?.awb ||
      awbResponse?.awb_code ||
      awbResponse?.awb ||
      null;

    const courierName =
      awbResponse?.response?.data?.courier_name ||
      awbResponse?.data?.courier_name ||
      awbResponse?.courier_name ||
      null;

    const status =
      awbResponse?.response?.data?.status ||
      awbResponse?.data?.status ||
      awbResponse?.status ||
      "AWB Generated";

    const trackingUrl =
      awbResponse?.response?.data?.tracking_url ||
      awbResponse?.data?.tracking_url ||
      awbResponse?.tracking_url ||
      null;

    if (!awbCode) {
      return res.status(500).json({
        success: false,
        message:
          "Shiprocket did not return an AWB code",
        shiprocket: awbResponse,
      });
    }

    order.shiprocketAwbCode =
      String(awbCode);

    order.shiprocketCourierName =
      courierName
        ? String(courierName)
        : null;

    order.shiprocketStatus =
      String(status);

    order.shiprocketTrackingUrl =
      trackingUrl
        ? String(trackingUrl)
        : null;

    await order.save();

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

// =====================================================
// SCHEDULE PICKUP - ADMIN
// =====================================================

export const scheduleOrderPickup = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found. Create the Shiprocket order first.",
      });
    }

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet. Generate AWB before scheduling pickup.",
      });
    }

    if (order.shiprocketPickupScheduled) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup has already been scheduled.",
      });
    }

    const pickupResponse =
      await generatePickup(
        order.shiprocketShipmentId
      );

    console.log(
      "🚚 Shiprocket Pickup Response:",
      pickupResponse
    );

    order.shiprocketPickupScheduled = true;

    if (
      order.orderStatus !== "shipped" &&
      order.orderStatus !== "delivered" &&
      order.orderStatus !== "cancelled"
    ) {
      order.orderStatus = "processing";
    }

    const status =
      pickupResponse?.response?.data?.status ||
      pickupResponse?.data?.status ||
      pickupResponse?.status ||
      "Pickup Scheduled";

    order.shiprocketStatus =
      String(status);

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Shiprocket pickup scheduled successfully",

      orderId: order._id,

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

// =====================================================
// GENERATE MANIFEST - ADMIN
// =====================================================

export const generateOrderManifest = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found.",
      });
    }

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet.",
      });
    }

    if (!order.shiprocketPickupScheduled) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup has not been scheduled yet.",
      });
    }

    if (order.shiprocketManifestId) {
      return res.status(400).json({
        success: false,
        message:
          "Manifest has already been generated.",
        manifestId:
          order.shiprocketManifestId,
        manifestUrl:
          order.shiprocketManifestUrl,
      });
    }

    const manifestResponse =
      await generateManifest(
        order.shiprocketShipmentId
      );

    console.log(
      "📄 Shiprocket Manifest Response:",
      manifestResponse
    );

    const manifestId =
      manifestResponse?.response?.data?.manifest_id ||
      manifestResponse?.response?.data?.manifestId ||
      manifestResponse?.data?.manifest_id ||
      manifestResponse?.data?.manifestId ||
      manifestResponse?.manifest_id ||
      manifestResponse?.manifestId ||
      null;

    const manifestUrl =
      manifestResponse?.response?.data?.manifest_url ||
      manifestResponse?.response?.data?.manifestUrl ||
      manifestResponse?.response?.data?.url ||
      manifestResponse?.data?.manifest_url ||
      manifestResponse?.data?.manifestUrl ||
      manifestResponse?.data?.url ||
      manifestResponse?.manifest_url ||
      manifestResponse?.manifestUrl ||
      manifestResponse?.url ||
      null;

    const status =
      manifestResponse?.response?.data?.status ||
      manifestResponse?.data?.status ||
      manifestResponse?.status ||
      "Manifest Generated";

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

    return res.status(200).json({
      success: true,
      message:
        "Shiprocket manifest generated successfully",

      orderId: order._id,

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

// =====================================================
// GENERATE SHIPPING LABEL - ADMIN
// =====================================================

export const generateOrderLabel = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found.",
      });
    }

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet.",
      });
    }

    const labelResponse =
      await generateLabel(
        order.shiprocketShipmentId
      );

    console.log(
      "📄 Shiprocket Label Response:",
      labelResponse
    );

    const labelUrl =
      labelResponse?.response?.data?.label_url ||
      labelResponse?.response?.data?.labelUrl ||
      labelResponse?.response?.data?.url ||
      labelResponse?.data?.label_url ||
      labelResponse?.data?.labelUrl ||
      labelResponse?.data?.url ||
      labelResponse?.label_url ||
      labelResponse?.labelUrl ||
      labelResponse?.url ||
      null;

    if (labelUrl) {
      order.shiprocketStatus =
        "Shipping Label Generated";

      order.shiprocketLabelUrl =
        String(labelUrl);

      await order.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Shipping label generated successfully",

      orderId: order._id,

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

// =====================================================
// GET SHIPMENT TRACKING - ADMIN
// =====================================================

export const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has not been generated yet. Generate AWB before tracking the shipment.",
      });
    }

    const trackingResponse =
      await getShipmentTracking(
        order.shiprocketAwbCode
      );

    console.log(
      "📍 Shiprocket Tracking Response:",
      trackingResponse
    );

    const trackingData =
      trackingResponse?.tracking_data ||
      trackingResponse?.data?.tracking_data ||
      null;

    const trackingStatus =
      trackingData?.shipment_status ||
      trackingData?.shipment_track?.[0]?.current_status ||
      null;

    if (trackingStatus) {
      order.shiprocketStatus =
        String(trackingStatus);

      await order.save();

      console.log(
        "✅ Shiprocket Status Updated:",
        order.shiprocketStatus
      );
    }

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
        order.shiprocketStatus ||
        "Not Available",

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