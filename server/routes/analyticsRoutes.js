import express from "express";

import {
  trackVisit,
  getVisitorAnalytics,
} from "../controllers/analyticsController.js";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
| Website visitors use this endpoint.
*/

router.post("/visit", trackVisit);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
| Only admin users can view analytics.
*/

router.get(
  "/visitors",
  protect,
  adminOnly,
  getVisitorAnalytics
);

export default router;