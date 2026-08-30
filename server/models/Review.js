import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    // PRODUCT
    // ==========================================
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ==========================================
    // RATING
    // ==========================================
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // ==========================================
    // REVIEW TITLE
    // ==========================================
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    // ==========================================
    // REVIEW DESCRIPTION
    // ==========================================
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // ==========================================
    // REVIEW PHOTO
    // ==========================================
    image: {
      type: String,
      default: "",
    },

    // ==========================================
    // ADMIN APPROVAL
    // ==========================================
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// ONE REVIEW PER USER PER PRODUCT
// ==========================================

reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

const Review = mongoose.model(
  "Review",
  reviewSchema
);

export default Review;