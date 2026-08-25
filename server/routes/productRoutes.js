import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from "../controllers/productController.js";

import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET ALL ACTIVE PRODUCTS
router.get("/", getProducts);

// ==========================================
// ADMIN ROUTES
// ==========================================

// GET ALL PRODUCTS FOR ADMIN
// IMPORTANT: This MUST be before /:id
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminProducts
);

// CREATE PRODUCT
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  createProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

// ==========================================
// PUBLIC SINGLE PRODUCT
// ==========================================

// GET SINGLE ACTIVE PRODUCT
router.get("/:id", getProductById);

export default router;