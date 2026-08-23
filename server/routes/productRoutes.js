import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from "../controllers/productController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN ROUTES FIRST
// ==========================================

// Get all products for admin
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminProducts
);

// Create product
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// Update product
router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all active products
router.get("/", getProducts);

// Get single active product
router.get("/:id", getProductById);

export default router;