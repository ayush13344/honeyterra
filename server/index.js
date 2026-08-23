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

const app = express();

const PORT = process.env.PORT || 3000;

await connectDB();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());



app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin/orders", adminOrderRoutes);



app.get("/", (req, res) => {
  res.send("server is live");
});

app.listen(PORT, () => {
  console.log(
    `server is running on port ${PORT}`
  );
});