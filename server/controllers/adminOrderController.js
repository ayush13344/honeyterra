
import Order from "../models/Order.js";

import {
  createShiprocketOrder,
  generateAWB,
  generatePickup,
  generateManifest,
  generateLabel,
  getShipmentTracking,
  getBestCourierForShipment,
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

    // ------------------------------------------
    // VALIDATE SHIPMENT ID
    // ------------------------------------------

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

    order.shiprocketOrderId =
      shiprocketOrderId
        ? String(shiprocketOrderId)
        : null;

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

    /*
      Courier ID is OPTIONAL.

      Normally the frontend should send {}.

      The backend will automatically find a
      serviceable courier for this order.
    */

    const {
      courierCompanyId: requestedCourierCompanyId,
    } = req.body || {};

    // ------------------------------------------
    // VALIDATE ORDER ID
    // ------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // ------------------------------------------
    // FIND ORDER
    // ------------------------------------------

    const order = await Order.findById(id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ------------------------------------------
    // CHECK SHIPROCKET SHIPMENT
    // ------------------------------------------

    if (!order.shiprocketShipmentId) {
      return res.status(400).json({
        success: false,
        message:
          "Shiprocket shipment ID not found. Create the Shiprocket order first.",
      });
    }

    // ------------------------------------------
    // PREVENT DUPLICATE AWB
    // ------------------------------------------

    if (order.shiprocketAwbCode) {
      return res.status(400).json({
        success: false,
        message:
          "AWB has already been generated for this order.",

        awbCode:
          order.shiprocketAwbCode,

        courierName:
          order.shiprocketCourierName,
      });
    }

    // ==========================================
    // DETERMINE COD / PREPAID
    // ==========================================

    const cod =
      order.paymentStatus === "paid"
        ? 0
        : 1;

    // ==========================================
    // DETERMINE WEIGHT
    // ==========================================

    const weight = Number(
      process.env.SHIPROCKET_WEIGHT || 0.5
    );

    if (!weight || weight <= 0) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid SHIPROCKET_WEIGHT in .env",
      });
    }

    // ==========================================
    // PICKUP PINCODE
    // ==========================================

    const pickupPostcode =
      process.env.SHIPROCKET_PICKUP_PINCODE;

    if (!pickupPostcode) {
      return res.status(500).json({
        success: false,
        message:
          "SHIPROCKET_PICKUP_PINCODE is missing in .env",
      });
    }

    // ==========================================
    // DELIVERY PINCODE
    // ==========================================

    const deliveryPostcode =
      order.shippingAddress?.pincode;

    if (!deliveryPostcode) {
      return res.status(400).json({
        success: false,
        message:
          "Customer delivery pincode is missing.",
      });
    }

    // ==========================================
    // START LOGGING
    // ==========================================

    console.log(
      "=========================================="
    );

    console.log(
      "🚚 STARTING AWB GENERATION"
    );

    console.log(
      "Order ID:",
      order._id.toString()
    );

    console.log(
      "Shipment ID:",
      order.shiprocketShipmentId
    );

    console.log(
      "Pickup Pincode:",
      pickupPostcode
    );

    console.log(
      "Delivery Pincode:",
      deliveryPostcode
    );

    console.log(
      "Weight:",
      weight
    );

    console.log(
      "COD:",
      cod
    );

    console.log(
      "=========================================="
    );

    // ==========================================
    // FIND COURIER
    // ==========================================

    let courierCompanyId = null;
    let selectedCourier = null;

    // ------------------------------------------
    // IF FRONTEND PROVIDED COURIER
    // ------------------------------------------

    if (requestedCourierCompanyId) {
      const parsedCourierId =
        Number(
          requestedCourierCompanyId
        );

      if (
        Number.isInteger(parsedCourierId) &&
        parsedCourierId > 0
      ) {
        courierCompanyId =
          parsedCourierId;

        console.log(
          "🚚 Frontend requested courier:",
          courierCompanyId
        );
      }
    }

    // ------------------------------------------
    // AUTOMATIC COURIER SELECTION
    // ------------------------------------------

    if (!courierCompanyId) {
      console.log(
        "🔍 Finding available courier automatically..."
      );

      selectedCourier =
        await getBestCourierForShipment({
          pickupPostcode,
          deliveryPostcode,
          weight,
          cod,
        });

      if (
        !selectedCourier ||
        !selectedCourier.courier_company_id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No valid courier is available for this shipment.",
        });
      }

      courierCompanyId =
        Number(
          selectedCourier.courier_company_id
        );

      console.log(
        "=========================================="
      );

      console.log(
        "✅ AUTOMATIC COURIER SELECTED"
      );

      console.log(
        "Courier ID:",
        courierCompanyId
      );

      console.log(
        "Courier Name:",
        selectedCourier.courier_name ||
          selectedCourier.name ||
          "Unknown"
      );

      console.log(
        "=========================================="
      );
    }

    // ==========================================
    // FINAL COURIER VALIDATION
    // ==========================================

    if (
      !courierCompanyId ||
      !Number.isInteger(courierCompanyId) ||
      courierCompanyId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No valid courier company was selected.",
      });
    }

    // ==========================================
    // GENERATE AWB
    // ==========================================

    let awbResponse;

    try {
      awbResponse =
        await generateAWB(
          order.shiprocketShipmentId,
          courierCompanyId
        );
    } catch (awbError) {
      const shiprocketError =
        awbError.response?.data ||
        awbError.message;

      console.error(
        "=========================================="
      );

      console.error(
        "❌ SHIPROCKET REJECTED AWB ASSIGNMENT"
      );

      console.error(
        "Shipment ID:",
        order.shiprocketShipmentId
      );

      console.error(
        "Courier ID:",
        courierCompanyId
      );

      console.error(
        "Shiprocket Error:",
        shiprocketError
      );

      console.error(
        "=========================================="
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to generate AWB",

        error:
          shiprocketError,

        courierCompanyId,

        shipmentId:
          order.shiprocketShipmentId,

        deliveryPostcode,
      });
    }

    // ==========================================
    // LOG RESPONSE
    // ==========================================

    console.log(
      "🚚 Shiprocket AWB Response:"
    );

    console.log(
      JSON.stringify(
        awbResponse,
        null,
        2
      )
    );

    // ==========================================
    // EXTRACT AWB CODE
    // ==========================================

    const awbCode =
      awbResponse?.response?.data?.awb_code ||
      awbResponse?.response?.data?.awb ||
      awbResponse?.data?.awb_code ||
      awbResponse?.data?.awb ||
      awbResponse?.awb_code ||
      awbResponse?.awb ||
      null;

    // ==========================================
    // EXTRACT COURIER NAME
    // ==========================================

    const courierName =
      awbResponse?.response?.data?.courier_name ||
      awbResponse?.data?.courier_name ||
      awbResponse?.courier_name ||
      selectedCourier?.courier_name ||
      selectedCourier?.name ||
      null;

    // ==========================================
    // EXTRACT STATUS
    // ==========================================

    const status =
      awbResponse?.response?.data?.status ||
      awbResponse?.data?.status ||
      awbResponse?.status ||
      "AWB Generated";

    // ==========================================
    // EXTRACT TRACKING URL
    // ==========================================

    const trackingUrl =
      awbResponse?.response?.data?.tracking_url ||
      awbResponse?.data?.tracking_url ||
      awbResponse?.tracking_url ||
      null;

    // ==========================================
    // CHECK AWB
    // ==========================================

    if (!awbCode) {
      console.error(
        "❌ Shiprocket did not return an AWB code:"
      );

      console.error(
        JSON.stringify(
          awbResponse,
          null,
          2
        )
      );

      return res.status(500).json({
        success: false,

        message:
          "Shiprocket did not return an AWB code",

        courierCompanyId,

        courierName,

        shiprocket:
          awbResponse,
      });
    }

    // ==========================================
    // SAVE AWB DETAILS
    // ==========================================

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

    // ==========================================
    // SUCCESS LOG
    // ==========================================

    console.log(
      "=========================================="
    );

    console.log(
      "✅ AWB GENERATED SUCCESSFULLY"
    );

    console.log(
      "AWB:",
      order.shiprocketAwbCode
    );

    console.log(
      "Courier:",
      order.shiprocketCourierName
    );

    console.log(
      "Courier ID:",
      courierCompanyId
    );

    console.log(
      "=========================================="
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "AWB generated successfully",

      orderId:
        order._id,

      shipmentId:
        order.shiprocketShipmentId,

      courierCompanyId,

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

      orderId:
        order._id,

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
