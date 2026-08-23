import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";


export const createReview = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      productId,
      rating,
      comment,
    } = req.body;


    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product, rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }


    const purchased = await Order.findOne({
      user: userId,

      "items.product": productId,

      orderStatus: "delivered",
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message:
          "You can review this product only after purchasing and receiving it",
      });
    }


    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name email")
      .populate("product", "name images");

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });


    let averageRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      averageRating = totalRating / reviews.length;
    }

    return res.status(200).json({
      success: true,

      count: reviews.length,

      averageRating: Number(
        averageRating.toFixed(1)
      ),

      reviews,
    });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      rating,
      comment,
    } = req.body;

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }


    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = rating;
    }



    if (comment !== undefined) {
      if (comment.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Comment is too short",
        });
      }

      review.comment = comment.trim();
    }

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("product", "name images");

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
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
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};



export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
    })
      .populate("product", "name images price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get My Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews",
      error: error.message,
    });
  }
};