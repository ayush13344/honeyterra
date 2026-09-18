
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

import { verifyEmailConfiguration } from "./config/emailService.js";
import { startAbandonedCartJob } from "./jobs/abandonedCartJob.js";

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",

  // Current Vercel deployment
  "https://honeyterra-rm7kdyul4-nagpalayush65-gmailcoms-projects.vercel.app",

  // Vercel project domain
  "https://honeyterra.vercel.app",

  // Production custom domain
  "https://honeyterra.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },

    credentials: true,
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

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
    // ==========================================
    // CONNECT MONGODB
    // ==========================================

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
      console.log(`🌐 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);

    process.exit(1);
  }
};

startServer();
