import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  Save,
  XCircle,
} from "lucide-react";
import "./OrderDetails.css";

const API_URL = "https://honeyterra.onrender.com";

// ==========================================
// STATUS CLASS
// ==========================================

const getStatusClass = (status = "") => {
  switch (status.toLowerCase()) {
    case "paid":
      return "details-status-paid";

    case "pending":
      return "details-status-pending";

    case "confirmed":
      return "details-status-processing";

    case "processing":
      return "details-status-processing";

    case "shipped":
      return "details-status-shipped";

    case "delivered":
      return "details-status-delivered";

    case "cancelled":
      return "details-status-cancelled";

    case "failed":
      return "details-status-cancelled";

    case "refunded":
      return "details-status-cancelled";

    default:
      return "";
  }
};

// ==========================================
// FORMAT STATUS
// ==========================================

const formatStatus = (status = "") => {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

// ==========================================
// ORDER DETAILS COMPONENT
// ==========================================

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // ORDER STATE
  // ==========================================

  const [order, setOrder] = useState(null);

  // ==========================================
  // PAYMENT STATE
  // ==========================================

  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    useState("pending");

  // ==========================================
  // LOADING / ERROR
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);

  // ==========================================
  // SHIPROCKET STATE
  // ==========================================

  const [shiprocketLoading, setShiprocketLoading] = useState(false);

  const [trackingLoading, setTrackingLoading] = useState(false);

  const [trackingError, setTrackingError] = useState("");

  const [trackingData, setTrackingData] = useState(null);

  // ==========================================
  // GET ADMIN TOKEN
  // ==========================================

  const getAdminToken = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      throw new Error("Admin token not found");
    }

    return token;
  };

  // ==========================================
  // FETCH ADMIN ORDER
  // ==========================================

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      console.log("📦 Fetching admin order:", orderId);

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("📦 Admin order response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch order"
        );
      }

      if (!data.success || !data.order) {
        throw new Error("Order not found");
      }

      setOrder(data.order);

      setSelectedPaymentStatus(
        data.order.paymentStatus || "pending"
      );
    } catch (error) {
      console.error(
        "❌ Fetch Admin Order Error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH ORDER WHEN ID CHANGES
  // ==========================================

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // ==========================================
  // CREATE SHIPROCKET ORDER
  // ==========================================

  const handleCreateShiprocketOrder = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (order.shiprocketShipmentId) {
        alert(
          "Shiprocket order has already been created."
        );

        return;
      }

      setShiprocketLoading(true);

      const token = getAdminToken();

      console.log(
        "🚚 Creating Shiprocket order for:",
        order._id
      );

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order._id}/shiprocket`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "🚚 Create Shiprocket response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create Shiprocket order"
        );
      }

      alert(
        "Shiprocket order created successfully!"
      );

      await fetchOrder();
    } catch (error) {
      console.error(
        "❌ Create Shiprocket Order Error:",
        error
      );

      alert(
        error.message ||
          "Failed to create Shiprocket order"
      );
    } finally {
      setShiprocketLoading(false);
    }
  };

  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const handlePaymentUpdate = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (
        selectedPaymentStatus ===
        order.paymentStatus
      ) {
        return;
      }

      setUpdatingPayment(true);

      const token = getAdminToken();

      console.log(
        "💳 Updating payment status:",
        selectedPaymentStatus
      );

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order._id}/payment-status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus:
              selectedPaymentStatus,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "💳 Payment update response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update payment status"
        );
      }

      if (data.order) {
        setOrder(data.order);

        setSelectedPaymentStatus(
          data.order.paymentStatus
        );
      } else {
        await fetchOrder();
      }

      alert(
        "Payment status updated successfully"
      );
    } catch (error) {
      console.error(
        "❌ Update Payment Error:",
        error
      );

      alert(
        error.message ||
          "Failed to update payment status"
      );
    } finally {
      setUpdatingPayment(false);
    }
  };

  // ==========================================
  // GENERATE AWB
  // ==========================================

  const handleGenerateAWB = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (!order.shiprocketShipmentId) {
        alert(
          "Create the Shiprocket order first."
        );

        return;
      }

      if (order.shiprocketAwbCode) {
        alert(
          `AWB already generated: ${order.shiprocketAwbCode}`
        );

        return;
      }

      setShiprocketLoading(true);

      const token = getAdminToken();

      console.log(
        "🚚 Generating AWB for:",
        order._id
      );

      /*
       * IMPORTANT:
       *
       * Do NOT send courierCompanyId: 58 anymore.
       *
       * The backend will now:
       * 1. Check Shiprocket serviceability.
       * 2. Find an eligible courier.
       * 3. Assign the AWB using that courier.
       *
       * This prevents the frontend from forcing a
       * potentially unauthorized/ineligible courier.
       */

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order._id}/awb`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      console.log(
        "🚚 Generate AWB response:",
        data
      );

      if (!response.ok) {
        /*
         * Shiprocket may return a nested error object.
         * Try to display the useful message.
         */

        const shiprocketMessage =
          data.shiprocketError?.message ||
          data.data?.message ||
          data.message ||
          "Failed to generate AWB";

        throw new Error(shiprocketMessage);
      }

      const awb =
        data.awbCode ||
        data.awb_code ||
        data.order?.shiprocketAwbCode ||
        data.data?.awb_code ||
        data.data?.data?.awb_code ||
        "Generated";

      const courier =
        data.courierName ||
        data.courier_name ||
        data.order?.shiprocketCourierName ||
        data.data?.courier_name ||
        "";

      alert(
        `AWB generated successfully!\nAWB: ${awb}${
          courier ? `\nCourier: ${courier}` : ""
        }`
      );

      await fetchOrder();
    } catch (error) {
      console.error(
        "❌ Generate AWB Error:",
        error
      );

      alert(
        error.message ||
          "Failed to generate AWB"
      );
    } finally {
      setShiprocketLoading(false);
    }
  };

  // ==========================================
  // SCHEDULE PICKUP
  // ==========================================

  const handleSchedulePickup = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (!order.shiprocketShipmentId) {
        alert(
          "Create the Shiprocket order first."
        );

        return;
      }

      if (!order.shiprocketAwbCode) {
        alert(
          "Generate AWB before scheduling pickup."
        );

        return;
      }

      if (order.shiprocketPickupScheduled) {
        alert(
          "Pickup has already been scheduled."
        );

        return;
      }

      setShiprocketLoading(true);

      const token = getAdminToken();

      console.log(
        "🚚 Scheduling pickup for:",
        order._id
      );

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order._id}/pickup`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "🚚 Schedule pickup response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to schedule pickup"
        );
      }

      alert(
        "Shiprocket pickup scheduled successfully!"
      );

      await fetchOrder();
    } catch (error) {
      console.error(
        "❌ Schedule Pickup Error:",
        error
      );

      alert(
        error.message ||
          "Failed to schedule pickup"
      );
    } finally {
      setShiprocketLoading(false);
    }
  };

  // ==========================================
  // GENERATE MANIFEST
  // ==========================================

  const handleGenerateManifest = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (!order.shiprocketShipmentId) {
        alert(
          "Create the Shiprocket order first."
        );

        return;
      }

      if (!order.shiprocketAwbCode) {
        alert(
          "Generate AWB before generating manifest."
        );

        return;
      }

      if (!order.shiprocketPickupScheduled) {
        alert(
          "Schedule pickup before generating manifest."
        );

        return;
      }

      if (order.shiprocketManifestId) {
        alert(
          "Manifest has already been generated."
        );

        return;
      }

      setShiprocketLoading(true);

      const token = getAdminToken();

      console.log(
        "📄 Generating manifest for:",
        order._id
      );

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order._id}/manifest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "📄 Generate manifest response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to generate manifest"
        );
      }

      alert(
        "Shiprocket manifest generated successfully!"
      );

      await fetchOrder();
    } catch (error) {
      console.error(
        "❌ Generate Manifest Error:",
        error
      );

      alert(
        error.message ||
          "Failed to generate manifest"
      );
    } finally {
      setShiprocketLoading(false);
    }
  };

  // ==========================================
  // GENERATE SHIPPING LABEL
  // ==========================================

  const handleGenerateLabel = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (!order.shiprocketShipmentId) {
        alert(
          "Create the Shiprocket order first."
        );

        return;
      }

      if (!order.shiprocketAwbCode) {
        alert(
          "Generate AWB before generating shipping label."
        );

        return;
      }

      setShiprocketLoading(true);

      const token = getAdminToken();

      console.log(
        "🏷️ Generating label for:",
        order._id
      );

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order._id}/label`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "🏷️ Generate label response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to generate shipping label"
        );
      }

      const labelUrl =
        data.labelUrl ||
        data.label_url ||
        data.url ||
        data.data?.label_url ||
        data.data?.data?.label_url ||
        data.order?.shiprocketLabelUrl;

      if (labelUrl) {
        window.open(
          labelUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }

      alert(
        "Shipping label generated successfully!"
      );

      await fetchOrder();
    } catch (error) {
      console.error(
        "❌ Generate Label Error:",
        error
      );

      alert(
        error.message ||
          "Failed to generate shipping label"
      );
    } finally {
      setShiprocketLoading(false);
    }
  };

  // ==========================================
  // TRACK SHIPMENT
  // ==========================================

  const handleTracking = async () => {
    try {
      if (!order?._id) {
        return;
      }

      if (!order.shiprocketAwbCode) {
        alert(
          "AWB has not been generated yet."
        );

        return;
      }

      setTrackingLoading(true);
      setTrackingError("");

      const token = getAdminToken();

      console.log(
        "📍 Fetching Shiprocket tracking for:",
        order._id
      );

      const response = await fetch(
        `${API_URL}/api/admin/orders/${order._id}/tracking`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "📍 Tracking response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch tracking"
        );
      }

      setTrackingData(data);

      setOrder((previousOrder) => ({
        ...previousOrder,

        shiprocketStatus:
          data.shiprocketStatus ||
          data.tracking?.tracking_data
            ?.shipment_status ||
          previousOrder?.shiprocketStatus,

        shiprocketTrackingUrl:
          data.trackingUrl ||
          data.tracking?.tracking_data
            ?.track_url ||
          previousOrder?.shiprocketTrackingUrl,

        shiprocketCourierName:
          data.courierName ||
          data.tracking?.tracking_data
            ?.courier_name ||
          previousOrder?.shiprocketCourierName,
      }));
    } catch (error) {
      console.error(
        "❌ Tracking Error:",
        error
      );

      setTrackingError(
        error.message ||
          "Failed to fetch tracking"
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="order-not-found">
        <Package size={40} />

        <h2>Loading Order...</h2>

        <p>
          Please wait while we load the
          order details.
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !order) {
    return (
      <div className="order-not-found">
        <XCircle size={40} />

        <h2>Order not found</h2>

        <p>
          {error ||
            "The order you are trying to view does not exist."}
        </p>

        <button
          onClick={() =>
            navigate("/admin/orders")
          }
          className="back-orders-btn"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>
      </div>
    );
  }

  // ==========================================
  // DATE
  // ==========================================

  const orderDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // ==========================================
  // CUSTOMER
  // ==========================================

  const customerName =
    order.user?.name ||
    order.shippingAddress?.fullName ||
    "Customer";

  const customerEmail =
    order.user?.email ||
    "No email available";

  const customerPhone =
    order.shippingAddress?.phone ||
    "No phone available";

  // ==========================================
  // SHIPPING ADDRESS
  // ==========================================

  const shippingAddress =
    order.shippingAddress;

  const completeAddress = [
    shippingAddress?.address ||
      shippingAddress?.addressLine,
    shippingAddress?.city,
    shippingAddress?.state,
    shippingAddress?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  // ==========================================
  // PAYMENT
  // ==========================================

  const paymentStatus =
    order.paymentStatus || "pending";

  // ==========================================
  // SHIPROCKET FLAGS
  // ==========================================

  const hasShipment = Boolean(
    order.shiprocketShipmentId
  );

  const hasAWB = Boolean(
    order.shiprocketAwbCode
  );

  const pickupScheduled = Boolean(
    order.shiprocketPickupScheduled
  );

  const hasManifest = Boolean(
    order.shiprocketManifestId
  );

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="order-details-page">

      {/* ========================================
          TOP HEADER
      ======================================== */}

      <div className="order-details-top">

        <button
          className="back-button"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="order-title-row">

          <div>
            <span className="details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>
              #{order._id}
            </h1>

            <p>
              Placed on {orderDate}
            </p>
          </div>

          <span
            className={`details-status ${getStatusClass(
              order.shiprocketStatus ||
                order.orderStatus
            )}`}
          >
            {formatStatus(
              order.shiprocketStatus ||
                order.orderStatus
            )}
          </span>

        </div>

      </div>

      {/* ==========================================
          PAYMENT STATUS
      ========================================== */}

      <section className="details-card status-update-card">

        <div className="card-heading">

          <div>
            <h2>
              Update Payment Status
            </h2>

            <p>
              Change the payment status
              of this order.
            </p>
          </div>

        </div>

        <div className="status-update-form">

          <div className="status-select-wrapper">

            <label>
              Payment Status
            </label>

            <select
              value={
                selectedPaymentStatus
              }
              onChange={(e) =>
                setSelectedPaymentStatus(
                  e.target.value
                )
              }
            >
              <option value="pending">
                Pending
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="refunded">
                Refunded
              </option>
            </select>

          </div>

          <button
            className="save-status-btn"
            onClick={
              handlePaymentUpdate
            }
            disabled={
              updatingPayment ||
              selectedPaymentStatus ===
                paymentStatus
            }
          >
            <Save size={17} />

            {updatingPayment
              ? "Updating..."
              : "Update Payment"}
          </button>

        </div>

      </section>

      {/* ==========================================
          CUSTOMER + SHIPPING
      ========================================== */}

      <div className="details-grid">

        {/* CUSTOMER */}

        <section className="details-card">

          <div className="card-heading">

            <div>
              <h2>
                Customer Information
              </h2>

              <p>
                Details about the
                customer.
              </p>
            </div>

            <User size={22} />

          </div>

          <div className="customer-details">

            <div className="customer-avatar">
              {customerName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h3>
                {customerName}
              </h3>

              <div className="contact-line">

                <Mail size={15} />

                <span>
                  {customerEmail}
                </span>

              </div>

              <div className="contact-line">

                <Phone size={15} />

                <span>
                  {customerPhone}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* SHIPPING */}

        <section className="details-card">

          <div className="card-heading">

            <div>
              <h2>
                Shipping Address
              </h2>

              <p>
                Delivery information.
              </p>
            </div>

            <MapPin size={22} />

          </div>

          <div className="address-box">

            <MapPin size={18} />

            <p>
              {completeAddress ||
                "No shipping address available"}
            </p>

          </div>

        </section>

      </div>

      {/* ==========================================
          PRODUCTS + PAYMENT
      ========================================== */}

      <div className="details-grid">

        {/* ORDER ITEMS */}

        <section className="details-card">

          <div className="card-heading">

            <div>
              <h2>
                Order Items
              </h2>

              <p>
                Products included in
                this order.
              </p>
            </div>

            <Package size={22} />

          </div>

          <div>

            {order.items?.map(
              (item, index) => {

                const productImage =
                  item.image ||
                  item.product?.images?.[0] ||
                  "";

                return (
                  <div
                    className="product-detail-row"
                    key={
                      item.product?._id ||
                      `${order._id}-${index}`
                    }
                  >

                    <div className="product-placeholder">

                      {productImage ? (
                        <img
                          src={productImage}
                          alt={
                            item.name
                          }
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                            borderRadius:
                              "8px",
                          }}
                        />
                      ) : (
                        <Package
                          size={25}
                        />
                      )}

                    </div>

                    <div className="product-detail-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity:{" "}
                        {item.quantity}
                      </p>

                      <p>
                        Price: ₹
                        {item.price}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {(
                        Number(
                          item.price || 0
                        ) *
                        Number(
                          item.quantity || 0
                        )
                      ).toFixed(2)}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* PAYMENT */}

        <section className="details-card">

          <div className="card-heading">

            <div>
              <h2>
                Payment Information
              </h2>

              <p>
                Payment details for
                this order.
              </p>
            </div>

            <CreditCard
              size={22}
            />

          </div>

          <div className="payment-info">

            <div className="payment-row">

              <span>
                Payment Status
              </span>

              <span
                className={`payment-badge ${getStatusClass(
                  paymentStatus
                )}`}
              >
                {formatStatus(
                  paymentStatus
                )}
              </span>

            </div>

            <div className="payment-row">

              <span>
                Payment Method
              </span>

              <strong>
                {order.razorpayPaymentId
                  ? "Razorpay"
                  : "Cash on Delivery"}
              </strong>

            </div>

            {order.razorpayOrderId && (
              <div className="payment-row">

                <span>
                  Razorpay Order ID
                </span>

                <strong>
                  {order.razorpayOrderId}
                </strong>

              </div>
            )}

            {order.razorpayPaymentId && (
              <div className="payment-row">

                <span>
                  Payment ID
                </span>

                <strong>
                  {order.razorpayPaymentId}
                </strong>

              </div>
            )}

            <div className="payment-row">

              <span>
                Total Items
              </span>

              <strong>
                {order.items?.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.quantity || 0
                    ),
                  0
                )}
              </strong>

            </div>

            <div className="payment-divider" />

            <div className="payment-row total-row">

              <span>
                Total
              </span>

              <strong>
                ₹{order.totalAmount}
              </strong>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default OrderDetails;