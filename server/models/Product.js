import mongoose from "mongoose";

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

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

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

// Generate slug automatically
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

const Product = mongoose.model("Product", productSchema);

export default Product;