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

    const response = await shiprocketApi.post("/auth/login", {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    if (!response.data?.token) {
      throw new Error(
        "Shiprocket authentication token was not received"
      );
    }

    console.log("✅ Shiprocket authentication successful");

    return response.data.token;
  } catch (error) {
    console.error("❌ Shiprocket Authentication Error:");
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
  data = null,
  params = null
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

    if (params) {
      config.params = params;
    }

    const response =
      await shiprocketApi.request(config);

    return response.data;
  } catch (error) {
    console.error("❌ Shiprocket API Error:");
    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// CREATE SHIPROCKET ORDER
// ==========================================

export const createShiprocketOrder = async (order) => {
  try {
    if (!order) {
      throw new Error("Order data is required");
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
      throw new Error("Order items are missing");
    }

    if (!process.env.SHIPROCKET_PICKUP_LOCATION) {
      throw new Error(
        "SHIPROCKET_PICKUP_LOCATION is missing in .env"
      );
    }

    const token =
      await getShiprocketToken();

    // ==========================================
    // CUSTOMER NAME
    // ==========================================

    const fullName =
      order.shippingAddress.fullName || "";

    const nameParts =
      fullName.trim().split(/\s+/);

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
    // PAYMENT METHOD
    // ==========================================

    const paymentMethod =
      order.paymentStatus === "paid"
        ? "Prepaid"
        : "COD";

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

      billing_country:
        "India",

      billing_email:
        order.user?.email || "",

      billing_phone:
        order.shippingAddress.phone,

      shipping_is_billing: true,

      order_items: orderItems,

      payment_method:
        paymentMethod,

      shipping_charges: 0,

      giftwrap_charges: 0,

      transaction_charges: 0,

      total_discount: 0,

      sub_total:
        Number(order.totalAmount),

      length:
        Number(
          process.env.SHIPROCKET_LENGTH || 10
        ),

      breadth:
        Number(
          process.env.SHIPROCKET_BREADTH || 10
        ),

      height:
        Number(
          process.env.SHIPROCKET_HEIGHT || 10
        ),

      weight:
        Number(
          process.env.SHIPROCKET_WEIGHT || 0.5
        ),
    };

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
// GET AVAILABLE COURIERS
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
      "🚚 Checking Shiprocket courier serviceability..."
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

    const response =
      await shiprocketApi.get(
        "/courier/serviceability/",
        {
          params: {
            pickup_postcode:
              pickupPostcode,

            delivery_postcode:
              deliveryPostcode,

            weight:
              Number(weight),

            cod:
              Number(cod),
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
// GET BEST COURIER FOR SHIPMENT
// ==========================================

export const getBestCourierForShipment =
  async ({
    pickupPostcode,
    deliveryPostcode,
    weight,
    cod,
  }) => {
    try {
      const serviceability =
        await getAvailableCouriers({
          pickupPostcode,
          deliveryPostcode,
          weight,
          cod,
        });

      console.log(
        "🚚 Shiprocket Serviceability Response:"
      );

      console.log(
        JSON.stringify(
          serviceability,
          null,
          2
        )
      );

      // ==========================================
      // GET SERVICEABILITY DATA
      // ==========================================

      const serviceabilityData =
        serviceability?.data ||
        serviceability;

      // ==========================================
      // GET COURIER LIST
      // ==========================================

      let courierList =
        serviceabilityData
          ?.available_courier_companies ||
        [];

      if (
        !Array.isArray(courierList) ||
        courierList.length === 0
      ) {
        throw new Error(
          "No courier is available for this shipment."
        );
      }

      // ==========================================
      // ONLY VALID COURIERS
      // ==========================================

      courierList =
        courierList.filter(
          (courier) => {
            return (
              courier &&
              courier.courier_company_id
            );
          }
        );

      if (courierList.length === 0) {
        throw new Error(
          "Shiprocket returned couriers, but no valid courier_company_id was found."
        );
      }

      // ==========================================
      // LOG EVERY AVAILABLE COURIER
      // ==========================================

      console.log(
        "=========================================="
      );

      console.log(
        "🚚 AVAILABLE SHIPROCKET COURIERS"
      );

      courierList.forEach(
        (courier, index) => {
          console.log({
            index: index + 1,

            id:
              courier.courier_company_id,

            name:
              courier.courier_name ||
              courier.name ||
              "Unknown",

            priority:
              courier.priority,

            rating:
              courier.rating ||
              courier.rating_average,

            etd:
              courier.etd ||
              courier.estimated_delivery_days,

            cod:
              courier.cod,

            active:
              courier.is_active,

            disabled:
              courier.is_disabled,
          });
        }
      );

      console.log(
        "=========================================="
      );

      // ==========================================
      // OPTIONAL MANUAL COURIER
      //
      // If you put:
      //
      // SHIPROCKET_COURIER_ID=58
      //
      // in .env, we will use it ONLY if
      // Shiprocket returned that courier as
      // available for this shipment.
      // ==========================================

      const configuredCourierId =
        Number(
          process.env.SHIPROCKET_COURIER_ID || 0
        );

      if (
        configuredCourierId > 0
      ) {
        const configuredCourier =
          courierList.find(
            (courier) =>
              Number(
                courier.courier_company_id
              ) ===
              configuredCourierId
          );

        if (configuredCourier) {
          console.log(
            "=========================================="
          );

          console.log(
            "✅ USING CONFIGURED COURIER"
          );

          console.log(
            "Courier ID:",
            configuredCourier.courier_company_id
          );

          console.log(
            "Courier Name:",
            configuredCourier.courier_name ||
              configuredCourier.name ||
              "Unknown"
          );

          console.log(
            "=========================================="
          );

          return configuredCourier;
        }

        console.log(
          `⚠️ Configured courier ${configuredCourierId} is NOT available for this shipment.`
        );
      }

      // ==========================================
      // GET SHIPROCKET RECOMMENDED COURIER
      // ==========================================

      const recommendedCourierId =
        Number(
          serviceabilityData
            ?.recommended_courier_company_id ||
          serviceabilityData
            ?.recommended_courier_companyid ||
          0
        );

      console.log(
        "⭐ Recommended Courier ID:",
        recommendedCourierId || "Not provided"
      );

      // ==========================================
      // USE RECOMMENDED COURIER ONLY IF IT IS
      // ACTUALLY PRESENT IN AVAILABLE LIST
      // ==========================================

      if (
        recommendedCourierId > 0
      ) {
        const recommendedCourier =
          courierList.find(
            (courier) =>
              Number(
                courier.courier_company_id
              ) ===
              recommendedCourierId
          );

        if (recommendedCourier) {
          console.log(
            "=========================================="
          );

          console.log(
            "⭐ USING AVAILABLE RECOMMENDED COURIER"
          );

          console.log(
            "Courier ID:",
            recommendedCourier.courier_company_id
          );

          console.log(
            "Courier Name:",
            recommendedCourier.courier_name ||
              recommendedCourier.name ||
              "Unknown"
          );

          console.log(
            "=========================================="
          );

          return recommendedCourier;
        }

        console.log(
          "⚠️ Recommended courier ID was NOT present in available courier list."
        );

        console.log(
          "⚠️ It will NOT be used."
        );
      }

      // ==========================================
      // REMOVE CLEARLY DISABLED COURIERS
      // ==========================================

      const usableCouriers =
        courierList.filter(
          (courier) => {
            if (
              courier.is_disabled === true
            ) {
              return false;
            }

            if (
              courier.active === false
            ) {
              return false;
            }

            if (
              courier.is_active === false
            ) {
              return false;
            }

            return true;
          }
        );

      const finalCouriers =
        usableCouriers.length > 0
          ? usableCouriers
          : courierList;

      // ==========================================
      // SORT COURIERS
      // ==========================================

      finalCouriers.sort(
        (a, b) => {
          const priorityA =
            Number(
              a.priority || 999
            );

          const priorityB =
            Number(
              b.priority || 999
            );

          if (
            priorityA !==
            priorityB
          ) {
            return (
              priorityA -
              priorityB
            );
          }

          const ratingA =
            Number(
              a.rating ||
                a.rating_average ||
                a.rating_average_score ||
                0
            );

          const ratingB =
            Number(
              b.rating ||
                b.rating_average ||
                b.rating_average_score ||
                0
            );

          if (
            ratingA !==
            ratingB
          ) {
            return (
              ratingB -
              ratingA
            );
          }

          const etdA =
            Number(
              a.etd ||
                a.estimated_delivery_days ||
                999
            );

          const etdB =
            Number(
              b.etd ||
                b.estimated_delivery_days ||
                999
            );

          return (
            etdA -
            etdB
          );
        }
      );

      // ==========================================
      // FINAL COURIER
      // ==========================================

      const selectedCourier =
        finalCouriers[0];

      if (
        !selectedCourier ||
        !selectedCourier.courier_company_id
      ) {
        throw new Error(
          "No usable Shiprocket courier was found."
        );
      }

      console.log(
        "=========================================="
      );

      console.log(
        "✅ FINAL COURIER SELECTED"
      );

      console.log(
        "Courier ID:",
        selectedCourier.courier_company_id
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

      return selectedCourier;
    } catch (error) {
      console.error(
        "❌ Failed to select Shiprocket courier:"
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

    const parsedShipmentId =
      Number(shipmentId);

    const parsedCourierId =
      Number(courierCompanyId);

    if (
      !Number.isInteger(
        parsedShipmentId
      ) ||
      parsedShipmentId <= 0
    ) {
      throw new Error(
        "Invalid shipment ID"
      );
    }

    if (
      !Number.isInteger(
        parsedCourierId
      ) ||
      parsedCourierId <= 0
    ) {
      throw new Error(
        "Invalid courier company ID"
      );
    }

    const token =
      await getShiprocketToken();

    console.log(
      "=========================================="
    );

    console.log(
      "🚚 GENERATING SHIPROCKET AWB"
    );

    console.log(
      "Shipment ID:",
      parsedShipmentId
    );

    console.log(
      "Courier Company ID:",
      parsedCourierId
    );

    console.log(
      "=========================================="
    );

    const payload = {
      shipment_id:
        parsedShipmentId,

      courier_id:
        parsedCourierId,
    };

    console.log(
      "AWB Request Payload:",
      payload
    );

    const response =
      await shiprocketApi.post(
        "/courier/assign/awb",
        payload,
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
      "=========================================="
    );

    console.log(
      "✅ SHIPROCKET AWB GENERATED"
    );

    console.log(
      "Shiprocket AWB Response:",
      response.data
    );

    console.log(
      "=========================================="
    );

    return response.data;
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      "❌ SHIPROCKET AWB GENERATION FAILED"
    );

    console.error(
      "HTTP Status:",
      error.response?.status
    );

    console.error(
      "Request:",
      error.config?.url
    );

    console.error(
      "Request Payload:",
      error.config?.data
    );

    console.error(
      "Shiprocket Response:",
      error.response?.data ||
        error.message
    );

    console.error(
      "=========================================="
    );

    throw error;
  }
};

// ==========================================
// SCHEDULE PICKUP
// ==========================================

export const generatePickup = async (
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
      "📦 Scheduling Shiprocket pickup..."
    );

    console.log(
      "Shipment ID:",
      shipmentId
    );

    const response =
      await shiprocketApi.post(
        "/courier/generate/pickup",
        {
          shipment_id:
            Number(shipmentId),
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
      "✅ Shiprocket pickup scheduled successfully"
    );

    console.log(
      "Shiprocket Pickup Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Pickup Generation Error:"
    );

    console.error(
      error.response?.data ||
        error.message
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
// GENERATE SHIPPING LABEL
// ==========================================

export const generateLabel = async (
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
      "🏷️ Generating Shiprocket shipping label..."
    );

    console.log(
      "Shipment ID:",
      shipmentId
    );

    const response =
      await shiprocketApi.post(
        "/courier/generate/label",
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
      "✅ Shipping label generated successfully"
    );

    console.log(
      "Shiprocket Label Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "❌ Shipping Label Generation Error:"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

// ==========================================
// GET SHIPROCKET TRACKING
// ==========================================

export const getShipmentTracking =
  async (awbCode) => {
    try {
      if (!awbCode) {
        throw new Error(
          "AWB code is required"
        );
      }

      const token =
        await getShiprocketToken();

      console.log(
        "📍 Fetching Shiprocket tracking..."
      );

      console.log(
        "AWB Code:",
        awbCode
      );

      const response =
        await shiprocketApi.get(
          `/courier/track/awb/${encodeURIComponent(
            awbCode
          )}`,
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
        "✅ Tracking information fetched"
      );

      console.log(
        "Shiprocket Tracking Response:",
        response.data
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Tracking Error:"
      );

      console.error(
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default shiprocketApi;