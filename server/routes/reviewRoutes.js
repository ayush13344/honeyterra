import express from "express";

import {
  createReview,
  getProductReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import protect from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==========================================
// GET PRODUCT REVIEWS
// PUBLIC
// ==========================================

router.get(
  "/product/:productId",
  getProductReviews
);

// ==========================================
// GET SINGLE REVIEW
// PUBLIC
// ==========================================

router.get(
  "/:id",
  getReviewById
);

// ==========================================
// CREATE REVIEW
// CUSTOMER
// ==========================================

router.post(
  "/",
  protect,
  upload.single("image"),
  createReview
);

// ==========================================
// UPDATE REVIEW
// CUSTOMER
// ==========================================

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateReview
);

// ==========================================
// DELETE REVIEW
// CUSTOMER
// ==========================================

router.delete(
  "/:id",
  protect,
  deleteReview
);

export default router;