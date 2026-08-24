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

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN ROUTES FIRST
// ==========================================

// GET ALL PRODUCTS FOR ADMIN

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminProducts
);

// ==========================================
// CREATE PRODUCT
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 6),
  createProduct
);

// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 6),
  updateProduct
);

// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET ALL ACTIVE PRODUCTS

router.get(
  "/",
  getProducts
);

// GET SINGLE PRODUCT

router.get(
  "/:id",
  getProductById
);

export default router;