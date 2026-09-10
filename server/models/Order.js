import mongoose from "mongoose";

// ==========================================
// ORDER ITEM SCHEMA
// ==========================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// SHIPPING ADDRESS SCHEMA
// ==========================================

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// ORDER SCHEMA
// ==========================================

const orderSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // ORDER ITEMS
    // ==========================================

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: function (items) {
          return items.length > 0;
        },

        message: "Order must contain at least one product",
      },
    },

    // ==========================================
    // SHIPPING ADDRESS
    // ==========================================

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    // ==========================================
    // TOTAL AMOUNT
    // ==========================================

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],

      default: "pending",
    },

    // ==========================================
    // ORDER STATUS
    // ==========================================

    orderStatus: {
      type: String,

      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],

      default: "pending",
    },

    // ==========================================
    // RAZORPAY DETAILS
    // ==========================================

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    // ==========================================
    // SHIPROCKET DETAILS
    // ==========================================

    // Shiprocket Order ID
    shiprocketOrderId: {
      type: String,
      default: null,
    },

    // Shiprocket Shipment ID
    shiprocketShipmentId: {
      type: String,
      default: null,
    },

    // Shiprocket AWB Number
    shiprocketAwbCode: {
      type: String,
      default: null,
    },

    // Shiprocket Courier Name
    shiprocketCourierName: {
      type: String,
      default: null,
    },

    // Shiprocket Tracking URL
    shiprocketTrackingUrl: {
      type: String,
      default: null,
    },

    // Current Shiprocket Status
    shiprocketStatus: {
      type: String,
      default: null,
    },

    // Whether pickup has been scheduled
    shiprocketPickupScheduled: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // SHIPROCKET MANIFEST DETAILS
    // ==========================================

    // Shiprocket Manifest ID
    shiprocketManifestId: {
      type: String,
      default: null,
    },

    // Shiprocket Manifest URL
    shiprocketManifestUrl: {
      type: String,
      default: null,
    },
  },

  // ==========================================
  // TIMESTAMPS
  // ==========================================

  {
    timestamps: true,
  }
);

// ==========================================
// CREATE MODEL
// ==========================================

const Order = mongoose.model("Order", orderSchema);

export default Order;