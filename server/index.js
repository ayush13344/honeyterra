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
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:3000",

  // Vercel deployments
  "https://honeyterra-rm7kdyul4-nagpalayush65-gmailcoms-projects.vercel.app",
  "https://honeyterra.vercel.app",

  // Production domains
  "https://honeyterra.com",
  "https://www.honeyterra.store",
  "https://honeyterra.store",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", origin);

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,
};

// Register CORS before all API routes.
// This also handles browser preflight requests.
app.use(cors(corsOptions));

// ==========================================
// GENERAL MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// API ROUTES
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
// ROOT & HEALTH
// ==========================================

app.get("/", (req, res) => {
  res.status(200).send("server is live");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// NOT FOUND HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Express error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An internal server error occurred"
        : err.message,
  });
});

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("MongoDB connected");

    console.log("✅ MongoDB connected");

    // ==========================================
    // START EXPRESS SERVER IMMEDIATELY
    // ==========================================
    // Start listening right away so Render / hosting platforms detect
    // the service is healthy and immediately route requests.
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // ==========================================
    // BACKGROUND INITIALIZATION (NON-BLOCKING)
    // ==========================================

    // Verify email service asynchronously without delaying server availability
    verifyEmailConfiguration().catch((err) => {
      console.error("❌ Email service initialization error:", err?.message || err);
    });

    // Defer initial abandoned cart scan by 10 seconds so cold start traffic gets full DB bandwidth
    setTimeout(() => {
      startAbandonedCartJob();
    }, 10000);
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();

