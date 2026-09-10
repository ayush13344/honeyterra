import Order from "../models/Order.js";
import shiprocketApi from "../config/shiprocket.js";
import { getShiprocketToken } from "../config/shiprocket.js";

// ==========================================
// CREATE SHIPROCKET ORDER
// ==========================================

export const createShiprocketOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // ==========================================
    // FIND HONEYTERRA ORDER
    // ==========================================

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate(
        "items.product",
        "name sku images price"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // PREVENT DUPLICATE SHIPROCKET ORDERS
    // ==========================================

    if (order.shiprocketOrderId) {
      return res.status(400).json({
        success: false,
        message: "This order is already registered with Shiprocket",
        shiprocketOrderId: order.shiprocketOrderId,
        shiprocketShipmentId: order.shiprocketShipmentId,
      });
    }

    // ==========================================
    // CHECK ORDER ITEMS
    // ==========================================

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order does not contain any products",
      });
    }

    // ==========================================
    // GET SHIPROCKET TOKEN
    // ==========================================

    const token = await getShiprocketToken();

    // ==========================================
    // PREPARE CUSTOMER NAME
    // ==========================================

    const fullName =
      order.shippingAddress.fullName?.trim() || "";

    const nameParts = fullName.split(" ");

    const firstName = nameParts[0] || "Customer";

    const lastName =
      nameParts.slice(1).join(" ") || "";

    // ==========================================
    // PREPARE PRODUCT DATA
    // ==========================================

    const orderItems = order.items.map((item) => ({
      name: item.name,

      sku:
        item.product?.sku ||
        `HT-${item.product?._id || item.product}`,

      units: item.quantity,

      selling_price: item.price,

      discount: 0,

      tax: 0,

      hsn: "",
    }));

    // ==========================================
    // CALCULATE SUBTOTAL
    // ==========================================

    const subtotal = order.items.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );

    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    const paymentMethod =
      order.paymentStatus === "paid"
        ? "Prepaid"
        : "COD";

    // ==========================================
    // SHIPROCKET ORDER PAYLOAD
    // ==========================================

    const shiprocketOrder = {
      order_id: `HT-${order._id}`,

      order_date: new Date(
        order.createdAt || Date.now()
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),

      pickup_location:
        process.env.SHIPROCKET_PICKUP_LOCATION ||
        "Primary",

      channel_id: "",

      comment: "HoneyTerra Order",

      billing_customer_name: firstName,

      billing_last_name: lastName,

      billing_address:
        order.shippingAddress.address,

      billing_address_2: "",

      billing_city:
        order.shippingAddress.city,

      billing_pincode:
        order.shippingAddress.pincode,

      billing_state:
        order.shippingAddress.state,

      billing_country: "India",

      billing_email:
        order.user?.email || "",

      billing_phone:
        order.shippingAddress.phone,

      shipping_is_billing: true,

      shipping_customer_name: firstName,

      shipping_last_name: lastName,

      shipping_address:
        order.shippingAddress.address,

      shipping_address_2: "",

      shipping_city:
        order.shippingAddress.city,

      shipping_pincode:
        order.shippingAddress.pincode,

      shipping_country: "India",

      shipping_state:
        order.shippingAddress.state,

      shipping_email:
        order.user?.email || "",

      shipping_phone:
        order.shippingAddress.phone,

      order_items: orderItems,

      payment_method: paymentMethod,

      shipping_charges: 0,

      giftwrap_charges: 0,

      transaction_charges: 0,

      total_discount: 0,

      sub_total: subtotal,

      length: 20,

      breadth: 15,

      height: 10,

      weight: 0.5,
    };

    console.log(
      "=========================================="
    );

    console.log(
      "Creating Shiprocket Order..."
    );

    console.log(
      "HoneyTerra Order:",
      order._id.toString()
    );

    console.log(
      "Shiprocket Payload:",
      shiprocketOrder
    );

    console.log(
      "=========================================="
    );

    // ==========================================
    // SEND ORDER TO SHIPROCKET
    // ==========================================

    const response =
      await shiprocketApi.post(
        "/orders/create/adhoc",
        shiprocketOrder,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    console.log(
      "Shiprocket Response:",
      response.data
    );

    // ==========================================
    // CHECK RESPONSE
    // ==========================================

    if (!response.data) {
      return res.status(500).json({
        success: false,
        message:
          "Shiprocket did not return a response",
      });
    }

    // ==========================================
    // SAVE SHIPROCKET INFORMATION
    // ==========================================

    order.shiprocketOrderId =
      response.data.order_id || null;

    order.shiprocketShipmentId =
      response.data.shipment_id || null;

    order.shiprocketStatus =
      "Order Created";

    await order.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Order successfully created in Shiprocket",

      shiprocket: {
        orderId:
          response.data.order_id,

        shipmentId:
          response.data.shipment_id,

        status:
          response.data.status,
      },

      order,
    });
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      "Shiprocket Create Order Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    console.error(
      "=========================================="
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