import axios from "axios";

const SHIPROCKET_BASE_URL =
  "https://apiv2.shiprocket.in/v1/external";

// ==========================================
// SHIPROCKET API
// ==========================================

const shiprocketApi = axios.create({
  baseURL: SHIPROCKET_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// GET SHIPROCKET TOKEN
// ==========================================

export const getShiprocketToken = async () => {
  try {
    if (
      !process.env.SHIPROCKET_EMAIL ||
      !process.env.SHIPROCKET_PASSWORD
    ) {
      throw new Error(
        "SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD is missing in .env"
      );
    }

    const response = await shiprocketApi.post(
      "/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    if (!response.data?.token) {
      throw new Error(
        "Shiprocket authentication token was not received"
      );
    }

    console.log(
      "✅ Shiprocket authentication successful"
    );

    return response.data.token;
  } catch (error) {
    console.error(
      "❌ Shiprocket Authentication Error:"
    );

    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// AUTHENTICATED SHIPROCKET REQUEST
// ==========================================

export const shiprocketRequest = async (
  method,
  endpoint,
  data = null
) => {
  try {
    const token = await getShiprocketToken();

    const config = {
      method,
      url: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response =
      await shiprocketApi.request(config);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Shiprocket API Error:"
    );

    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// CREATE SHIPROCKET ORDER
// ==========================================

export const createShiprocketOrder = async (
  order
) => {
  try {
    if (!order) {
      throw new Error(
        "Order data is required"
      );
    }

    if (!order.shippingAddress) {
      throw new Error(
        "Order shipping address is missing"
      );
    }

    if (
      !order.items ||
      !Array.isArray(order.items) ||
      order.items.length === 0
    ) {
      throw new Error(
        "Order items are missing"
      );
    }

    if (
      !process.env.SHIPROCKET_PICKUP_LOCATION
    ) {
      throw new Error(
        "SHIPROCKET_PICKUP_LOCATION is missing in .env"
      );
    }

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token =
      await getShiprocketToken();

    // ==========================================
    // CUSTOMER NAME
    // ==========================================

    const fullName =
      order.shippingAddress.fullName || "";

    const nameParts = fullName
      .trim()
      .split(/\s+/);

    const firstName =
      nameParts.shift() || "Customer";

    const lastName =
      nameParts.join(" ") || "";

    // ==========================================
    // ORDER ITEMS
    // ==========================================

    const orderItems =
      order.items.map((item) => ({
        name: item.name || "Product",

        sku: item.product
          ? item.product.toString()
          : `SKU-${item._id || "PRODUCT"}`,

        units: Number(item.quantity),

        selling_price: Number(item.price),

        discount: 0,

        tax: 0,

        hsn: "",
      }));

    // ==========================================
    // SHIPROCKET ORDER PAYLOAD
    // ==========================================

    const shiprocketOrderData = {
      order_id:
        order._id.toString(),

      order_date: new Date(
        order.createdAt || Date.now()
      )
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),

      pickup_location:
        process.env.SHIPROCKET_PICKUP_LOCATION,

      billing_customer_name:
        firstName,

      billing_last_name:
        lastName,

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

      order_items: orderItems,

      payment_method:
        order.paymentStatus === "paid"
          ? "Prepaid"
          : "COD",

      shipping_charges: 0,

      giftwrap_charges: 0,

      transaction_charges: 0,

      total_discount: 0,

      sub_total:
        Number(order.totalAmount),

      length: Number(
        process.env.SHIPROCKET_LENGTH || 10
      ),

      breadth: Number(
        process.env.SHIPROCKET_BREADTH || 10
      ),

      height: Number(
        process.env.SHIPROCKET_HEIGHT || 10
      ),

      weight: Number(
        process.env.SHIPROCKET_WEIGHT || 0.5
      ),
    };

    // ==========================================
    // LOG REQUEST
    // ==========================================

    console.log(
      "📦 Creating Shiprocket order..."
    );

    console.log(
      JSON.stringify(
        shiprocketOrderData,
        null,
        2
      )
    );

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const response =
      await shiprocketApi.post(
        "/orders/create/adhoc",
        shiprocketOrderData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    // ==========================================
    // SUCCESS
    // ==========================================

    console.log(
      "✅ Shiprocket order created successfully"
    );

    console.log(
      "Shiprocket Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Shiprocket Order Creation Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

// ==========================================
// CHECK AVAILABLE COURIERS
// ==========================================

export const getAvailableCouriers = async ({
  pickupPostcode,
  deliveryPostcode,
  weight = 0.5,
  cod = 1,
}) => {
  try {
    if (!pickupPostcode) {
      throw new Error(
        "Pickup postcode is required"
      );
    }

    if (!deliveryPostcode) {
      throw new Error(
        "Delivery postcode is required"
      );
    }

    const token =
      await getShiprocketToken();

    console.log(
      "🚚 Checking available Shiprocket couriers..."
    );

    const response =
      await shiprocketApi.get(
        "/courier/serviceability/",
        {
          params: {
            pickup_postcode:
              pickupPostcode,

            delivery_postcode:
              deliveryPostcode,

            weight: Number(weight),

            cod: Number(cod),
          },

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    console.log(
      "✅ Courier serviceability checked"
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Courier Serviceability Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

// ==========================================
// GENERATE AWB
// ==========================================

export const generateAWB = async (
  shipmentId,
  courierCompanyId
) => {
  try {
    // ==========================================
    // VALIDATION
    // ==========================================

    if (!shipmentId) {
      throw new Error(
        "Shipment ID is required"
      );
    }

    if (!courierCompanyId) {
      throw new Error(
        "Courier company ID is required"
      );
    }

    // ==========================================
    // GET TOKEN
    // ==========================================

    const token =
      await getShiprocketToken();

    // ==========================================
    // LOG REQUEST
    // ==========================================

    console.log(
      "🚚 Generating Shiprocket AWB..."
    );

    console.log(
      "Shipment ID:",
      shipmentId
    );

    console.log(
      "Courier Company ID:",
      courierCompanyId
    );

    // ==========================================
    // ASSIGN AWB
    // ==========================================

    const response =
      await shiprocketApi.post(
        "/courier/assign/awb",
        {
          shipment_id:
            Number(shipmentId),

          courier_id:
            Number(courierCompanyId),
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    // ==========================================
    // SUCCESS
    // ==========================================

    console.log(
      "✅ AWB generated successfully"
    );

    console.log(
      "Shiprocket AWB Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ AWB Generation Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    throw error;
  }
};
// ==========================================
// GENERATE / SCHEDULE PICKUP
// ==========================================
export const generatePickup = async (shipmentId) => {
  try {
    if (!shipmentId) {
      throw new Error("Shipment ID is required");
    }

    const token = await getShiprocketToken();

    console.log("📦 Scheduling Shiprocket pickup...");
    console.log("Shipment ID:", shipmentId);

    const response = await shiprocketApi.post(
      "/courier/generate/pickup",
      {
        shipment_id: Number(shipmentId),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Shiprocket pickup scheduled successfully");

    console.log(
      "Shiprocket Pickup Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error("❌ Pickup Generation Error:");

    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
};
// ==========================================
// GENERATE MANIFEST
// ==========================================

export const generateManifest = async (
  shipmentId
) => {
  try {
    if (!shipmentId) {
      throw new Error(
        "Shipment ID is required"
      );
    }

    const token =
      await getShiprocketToken();

    console.log(
      "📄 Generating Shiprocket manifest..."
    );

    console.log(
      "Shipment ID:",
      shipmentId
    );

    const response =
      await shiprocketApi.post(
        "/manifests/generate",
        {
          shipment_id: [
            Number(shipmentId),
          ],
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

    console.log(
      "✅ Shiprocket manifest generated successfully"
    );

    console.log(
      "Shiprocket Manifest Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Manifest Generation Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    throw error;
  }
};
// ==========================================
// GENERATE SHIPROCKET SHIPPING LABEL
// ==========================================

export const generateLabel = async (shipmentId) => {
  try {
    if (!shipmentId) {
      throw new Error("Shipment ID is required");
    }

    const token = await getShiprocketToken();

    console.log("🏷️ Generating Shiprocket shipping label...");
    console.log("Shipment ID:", shipmentId);

    const response = await shiprocketApi.post(
      "/courier/generate/label",
      {
        shipment_id: [Number(shipmentId)],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Shipping label generated successfully");
    console.log("Shiprocket Label Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Shipping Label Generation Error:");
    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
};
// ==========================================
// GET SHIPROCKET TRACKING
// ==========================================

export const getShipmentTracking = async (awbCode) => {
  try {
    if (!awbCode) {
      throw new Error("AWB code is required");
    }

    const token = await getShiprocketToken();

    console.log("📍 Fetching Shiprocket tracking...");
    console.log("AWB Code:", awbCode);

    const response = await shiprocketApi.get(
      `/courier/track/awb/${encodeURIComponent(awbCode)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Tracking information fetched");
    console.log(
      "Shiprocket Tracking Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error("❌ Tracking Error:");
    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default shiprocketApi;