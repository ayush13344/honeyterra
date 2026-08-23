import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes require login
router.use(protect);

// Get current user's cart
router.get("/", getCart);

// Add product
router.post("/add", addToCart);

// Update quantity
router.put("/update/:productId", updateCartItem);

// Remove product
router.delete("/remove/:productId", removeFromCart);

// Clear cart
router.delete("/clear", clearCart);

export default router;