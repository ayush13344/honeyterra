import express from "express";

import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getMyReviews,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get(
  "/product/:productId",
  getProductReviews
);



router.post(
  "/",
  protect,
  createReview
);



router.get(
  "/my-reviews",
  protect,
  getMyReviews
);



router.patch(
  "/:id",
  protect,
  updateReview
);



router.delete(
  "/:id",
  protect,
  deleteReview
);


export default router;