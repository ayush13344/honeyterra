import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    page: {
      type: String,
      default: "/",
      trim: true,
    },

    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },

    referrer: {
      type: String,
      default: "",
      trim: true,
    },

    userAgent: {
      type: String,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ visitorId: 1, createdAt: -1 });
visitorSchema.index({ sessionId: 1, createdAt: -1 });

const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;