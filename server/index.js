
import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminCustomerRoutes from "./routes/adminCustomerRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shiprocketRoutes from "./routes/shiprocketRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import {
  verifyEmailConfiguration,
} from "./config/emailService.js";

import {
  startAbandonedCartJob,
} from "./jobs/abandonedCartJob.js";

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "https://honeyterra.vercel.app/",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);

app.use("/api/admin/customers", adminCustomerRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/shiprocket", shiprocketRoutes);

app.use("/api/analytics", analyticsRoutes);

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
  res.send("server is live");
});

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    // Connect MongoDB first
    await connectDB();

    console.log("✅ MongoDB connected");

    // ==========================================
    // EMAIL SERVICE
    // ==========================================

    await verifyEmailConfiguration();

    // ==========================================
    // ABANDONED CART JOB
    // ==========================================

    startAbandonedCartJob();

    // ==========================================
    // START EXPRESS SERVER
    // ==========================================

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

startServer();
