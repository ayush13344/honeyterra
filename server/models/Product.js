import mongoose from "mongoose";

// ==========================================
// VARIANT SCHEMA
// ==========================================

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Variant name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Variant price is required"],
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sku: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  }
);

// ==========================================
// PRODUCT SCHEMA
// ==========================================

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Gel Ash Trays",
        "Honeycomb Wraps",
        "Bundles",
        "Accessories",
      ],
    },

    // ==========================================
    // PRODUCT VARIANTS
    // ==========================================

    variants: {
      type: [variantSchema],
      default: [],
    },

    // ==========================================
    // IMAGES
    // ==========================================

    images: {
      type: [String],
      default: [],
    },

    // ==========================================
    // STOCK
    // ==========================================

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      default: 0,
    },

    // ==========================================
    // SETTINGS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // REVIEWS
    // ==========================================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// GENERATE SLUG
// ==========================================

productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  next();
});

// ==========================================
// MODEL
// ==========================================

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;