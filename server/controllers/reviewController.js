import Review from "../models/Review.js";
import Product from "../models/Product.js";

// ==========================================
// CREATE REVIEW
// ==========================================

export const createReview = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      productId,
      rating,
      title,
      comment,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review description is required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // ==========================================
    // CHECK PRODUCT
    // ==========================================

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // CHECK EXISTING REVIEW
    // ==========================================

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "You have already reviewed this product",
      });
    }

    // ==========================================
    // REVIEW IMAGE
    // ==========================================

    let image = "";

    if (req.file) {
      image = req.file.path;
    }

    // ==========================================
    // CREATE REVIEW
    // ==========================================

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: Number(rating),
      title: title || "",
      comment: comment.trim(),
      image,
      isApproved: true,
    });

    // ==========================================
    // POPULATE USER
    // ==========================================

    const populatedReview =
      await Review.findById(review._id).populate(
        "user",
        "name email"
      );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "Create Review Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// ==========================================
// GET PRODUCT REVIEWS
// ==========================================

export const getProductReviews = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .populate("user", "name")
      .sort({
        createdAt: -1,
      });

    // ==========================================
    // CALCULATE RATING
    // ==========================================

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating),
      0
    );

    const averageRating =
      totalReviews > 0
        ? totalRating / totalReviews
        : 0;

    // ==========================================
    // RATING BREAKDOWN
    // ==========================================

    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      ratingBreakdown[review.rating]++;
    });

    return res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating:
        Math.round(averageRating * 10) / 10,
      ratingBreakdown,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get Product Reviews Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE REVIEW
// ==========================================

export const getReviewById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      isApproved: true,
    })
      .populate("user", "name email")
      .populate(
        "product",
        "name images price"
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(
      "Get Review Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch review",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE MY REVIEW
// ==========================================

export const updateReview = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const {
      rating,
      title,
      comment,
    } = req.body;

    const review = await Review.findOne({
      _id: id,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // ==========================================
    // VALIDATE RATING
    // ==========================================

    if (
      rating !== undefined &&
      (Number(rating) < 1 ||
        Number(rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5",
      });
    }

    // ==========================================
    // UPDATE FIELDS
    // ==========================================

    if (rating !== undefined) {
      review.rating = Number(rating);
    }

    if (title !== undefined) {
      review.title = title;
    }

    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Review description cannot be empty",
        });
      }

      review.comment = comment.trim();
    }

    // ==========================================
    // UPDATE IMAGE
    // ==========================================

    if (req.file) {
      review.image = req.file.path;
    }

    await review.save();

    const updatedReview =
      await Review.findById(review._id).populate(
        "user",
        "name email"
      );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error(
      "Update Review Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE MY REVIEW
// ==========================================

export const deleteReview = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Review Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};