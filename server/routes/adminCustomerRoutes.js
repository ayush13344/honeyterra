import express from "express";

import {
  getAllCustomers,
} from "../controllers/adminCustomerController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// GET ALL CUSTOMERS - ADMIN
// ==========================================

router.get("/", protect, getAllCustomers);

export default router;