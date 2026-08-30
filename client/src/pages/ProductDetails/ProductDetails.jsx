
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Package,
  Star,
  Camera,
  Trash2,
  X,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import { useCart } from "../../context/CartContext";

import "./ProductDetails.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);

  // ==========================================
  // IMAGE GALLERY STATE
  // ==========================================

  const [selectedImage, setSelectedImage] = useState(0);

  // ==========================================
  // REVIEW STATES
  // ==========================================

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [reviewImage, setReviewImage] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState("");

  const [submittingReview, setSubmittingReview] =
    useState(false);

  const [reviewSuccess, setReviewSuccess] = useState("");

  // Popup state
  const [showReviewModal, setShowReviewModal] =
    useState(false);

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log("Product details:", data);

        if (!data.success || !data.product) {
          throw new Error("Product not found");
        }

        setProduct(data.product);

        // Reset gallery to first image whenever product changes
        setSelectedImage(0);
      } catch (err) {
        console.error("Product details error:", err);

        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ==========================================
  // FETCH REVIEWS
  // ==========================================

  const fetchReviews = async () => {
    if (!id) return;

    try {
      setReviewsLoading(true);
      setReviewError("");

      const response = await fetch(
        `${API_URL}/api/reviews/product/${id}`
      );

      const data = await response.json();

      console.log("Reviews API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reviews"
        );
      }

      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Fetch Reviews Error:", err);

      setReviewError(
        err.message || "Unable to load reviews."
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // ==========================================
  // OPEN REVIEW MODAL
  // ==========================================

  const openReviewModal = () => {
    const token = localStorage.getItem("token");

    setReviewError("");
    setReviewSuccess("");

    if (!token) {
      setReviewError("Please login to write a review.");
      return;
    }

    setShowReviewModal(true);
  };

  // ==========================================
  // CLOSE REVIEW MODAL
  // ==========================================

  const closeReviewModal = () => {
    if (submittingReview) return;

    setShowReviewModal(false);
    setReviewError("");
    setReviewSuccess("");
  };

  // ==========================================
  // QUANTITY
  // ==========================================

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(product?.stock || 1, current + 1)
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // ==========================================
  // HANDLE REVIEW IMAGE
  // ==========================================

  const handleReviewImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setReviewError(
        "Image size should be less than 5MB."
      );
      return;
    }

    if (!file.type.startsWith("image/")) {
      setReviewError(
        "Please select a valid image."
      );
      return;
    }

    setReviewError("");

    setReviewImage(file);

    const previewUrl = URL.createObjectURL(file);

    setReviewImagePreview(previewUrl);
  };

  // ==========================================
  // REMOVE REVIEW IMAGE
  // ==========================================

  const removeReviewImage = () => {
    if (reviewImagePreview) {
      URL.revokeObjectURL(reviewImagePreview);
    }

    setReviewImage(null);
    setReviewImagePreview("");
  };

  // ==========================================
  // SUBMIT REVIEW
  // ==========================================

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    setReviewError("");
    setReviewSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setReviewError(
        "Please login to write a review."
      );
      return;
    }

    if (rating < 1 || rating > 5) {
      setReviewError(
        "Please select a star rating."
      );
      return;
    }

    if (!reviewText.trim()) {
      setReviewError(
        "Please write your review."
      );
      return;
    }

    if (!product?._id) {
      setReviewError(
        "Product information is missing. Please refresh the page."
      );
      return;
    }

    try {
      setSubmittingReview(true);

      const formData = new FormData();

      // IMPORTANT:
      // Backend expects productId
      formData.append(
        "productId",
        product._id
      );

      formData.append(
        "rating",
        rating
      );

      formData.append(
        "comment",
        reviewText.trim()
      );

      if (reviewImage) {
        formData.append(
          "image",
          reviewImage
        );
      }

      const response = await fetch(
        `${API_URL}/api/reviews`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      console.log(
        "Create Review Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit review"
        );
      }

      setReviewSuccess(
        "Thank you! Your review has been submitted."
      );

      setRating(0);
      setHoverRating(0);
      setReviewText("");

      setReviewImage(null);
      setReviewImagePreview("");

      await fetchReviews();

      // Close popup after successful submission
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSuccess("");
      }, 1200);
    } catch (err) {
      console.error(
        "Submit Review Error:",
        err
      );

      setReviewError(
        err.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDeleteReview = async (
    reviewId
  ) => {
    const token =
      localStorage.getItem("token");

    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete review"
        );
      }

      await fetchReviews();
    } catch (err) {
      console.error(
        "Delete Review Error:",
        err
      );

      setReviewError(
        err.message ||
          "Unable to delete review."
      );
    }
  };

  // ==========================================
  // RATING CALCULATIONS
  // ==========================================

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
          (total, review) =>
            total +
            Number(review.rating || 0),
          0
        ) / totalReviews
      : 0;

  const getRatingCount = (star) => {
    return reviews.filter(
      (review) =>
        Number(review.rating) === star
    ).length;
  };

  const getRatingPercentage = (star) => {
    if (totalReviews === 0) return 0;

    return Math.round(
      (getRatingCount(star) /
        totalReviews) *
        100
    );
  };

  // ==========================================
  // FORMAT REVIEW DATE
  // ==========================================

  const formatReviewDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // GET REVIEW USER NAME
  // ==========================================

  const getReviewUserName = (review) => {
    if (review.user?.name) {
      return review.user.name;
    }

    if (review.user?.email) {
      return review.user.email;
    }

    if (review.name) {
      return review.name;
    }

    return "Customer";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-loading">
          <div className="product-details-spinner"></div>

          <p>Loading product...</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-error">
          <h2>Product not found</h2>

          <p>
            {error ||
              "This product could not be found."}
          </p>

          <Link
            to="/shop"
            className="product-details-back-button"
          >
            <ArrowLeft size={17} />

            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  const {
    name,
    description,
    price,
    compareAtPrice,
    category,
    images,
    stock,
  } = product;

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================

  const productImages =
    Array.isArray(images)
      ? images.filter(
          (image) =>
            typeof image === "string" &&
            image.trim() !== ""
        )
      : [];

  const productImage =
    productImages[selectedImage] ||
    productImages[0] ||
    null;

  // ==========================================
  // DISCOUNT
  // ==========================================

  const discount =
    compareAtPrice > price
      ? Math.round(
          ((compareAtPrice - price) /
            compareAtPrice) *
            100
        )
      : 0;

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <main className="product-details-page">

      {/* ==========================================
          PRODUCT SECTION
      ========================================== */}

      <section className="product-details-main">

        <div className="product-details-container">

          <Link
            to="/shop"
            className="product-details-back"
          >
            <ArrowLeft size={17} />

            Back to Shop
          </Link>

          <div className="product-details-layout">

            {/* ==========================================
                IMAGE GALLERY
            ========================================== */}

            <div className="product-details-image-section">

              {/* MAIN IMAGE */}

              <div className="product-details-image-wrapper">

                {discount > 0 && (
                  <span className="product-details-discount">
                    {discount}% OFF
                  </span>
                )}

                {productImage ? (
                  <img
                    src={productImage}
                    alt={name}
                    className="product-details-image"
                  />
                ) : (
                  <div className="product-details-image-placeholder">

                    <Package size={45} />

                    <span>
                      Product Image
                    </span>

                  </div>
                )}

              </div>

              {/* ==========================================
                  THUMBNAIL IMAGES
              ========================================== */}

              {productImages.length > 1 && (
                <div className="product-details-thumbnails">

                  {productImages.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={`product-details-thumbnail ${
                          selectedImage === index
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedImage(index)
                        }
                        aria-label={`View product image ${
                          index + 1
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${name} ${
                            index + 1
                          }`}
                        />
                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            {/* ==========================================
                INFORMATION
            ========================================== */}

            <div className="product-details-info">

              <span className="product-details-category">
                {category}
              </span>

              <h1>{name}</h1>

              {description && (
                <p className="product-details-description">
                  {description}
                </p>
              )}

              {/* ==========================================
                  PRODUCT RATING
              ========================================== */}

              <div className="product-details-rating-summary">

                <div className="product-details-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={17}
                        fill={
                          star <=
                          Math.round(
                            averageRating
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    )
                  )}

                </div>

                <strong>
                  {averageRating > 0
                    ? averageRating.toFixed(1)
                    : "0.0"}
                </strong>

                <span>
                  ({totalReviews}{" "}
                  {totalReviews === 1
                    ? "review"
                    : "reviews"})
                </span>

              </div>

              {/* ==========================================
                  PRICE
              ========================================== */}

              <div className="product-details-price-row">

                <span className="product-details-price">
                  ₹
                  {Number(
                    price
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

                {compareAtPrice > price && (
                  <span className="product-details-old-price">
                    ₹
                    {Number(
                      compareAtPrice
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                )}

                {discount > 0 && (
                  <span className="product-details-save">
                    Save {discount}%
                  </span>
                )}

              </div>

              <div className="product-details-divider"></div>

              {/* ==========================================
                  STOCK
              ========================================== */}

              {stock > 0 ? (
                <div className="product-details-stock available">

                  <Check size={17} />

                  In Stock

                  <span>
                    ({stock} available)
                  </span>

                </div>
              ) : (
                <div className="product-details-stock unavailable">
                  Out of Stock
                </div>
              )}

              {/* ==========================================
                  QUANTITY
              ========================================== */}

              {stock > 0 && (
                <div className="product-details-quantity-section">

                  <span className="product-details-label">
                    Quantity
                  </span>

                  <div className="product-details-quantity">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <= 1
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >= stock
                      }
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                </div>
              )}

              {/* ==========================================
                  ADD TO CART
              ========================================== */}

              <button
                type="button"
                className="product-details-cart-button"
                onClick={
                  handleAddToCart
                }
                disabled={stock <= 0}
              >
                <ShoppingCart size={19} />

                {stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              {/* ==========================================
                  FEATURES
              ========================================== */}

              <div className="product-details-features">

                <div className="product-details-feature">

                  <div className="product-details-feature-icon">
                    <Package size={19} />
                  </div>

                  <div>

                    <strong>
                      Quality Product
                    </strong>

                    <span>
                      Made for everyday use
                    </span>

                  </div>

                </div>

                <div className="product-details-feature">

                  <div className="product-details-feature-icon">
                    <Check size={19} />
                  </div>

                  <div>

                    <strong>
                      Genuine HoneyTerra
                    </strong>

                    <span>
                      Authentic product
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==========================================
          REVIEWS SECTION
      ========================================== */}

      <section className="product-reviews-section">

        <div className="product-details-container">

          {/* REVIEW HEADER */}

          <div className="product-reviews-heading">

            <div>

              <span className="product-reviews-eyebrow">
                CUSTOMER FEEDBACK
              </span>

              <h2>
                Reviews & Ratings
              </h2>

              <p>
                See what other customers think
                about this product.
              </p>

            </div>

            <div className="reviews-count-box">

              <Star
                size={18}
                fill="currentColor"
              />

              <strong>
                {averageRating > 0
                  ? averageRating.toFixed(1)
                  : "0.0"}
              </strong>

              <span>
                {totalReviews}{" "}
                {totalReviews === 1
                  ? "Review"
                  : "Reviews"}
              </span>

            </div>

          </div>

          {/* RATING SUMMARY */}

          {totalReviews > 0 && (
            <div className="reviews-summary-card">

              <div className="reviews-average">

                <strong>
                  {averageRating.toFixed(1)}
                </strong>

                <div className="reviews-average-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={20}
                        fill={
                          star <=
                          Math.round(
                            averageRating
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    )
                  )}

                </div>

                <span>
                  Based on {totalReviews}{" "}
                  {totalReviews === 1
                    ? "review"
                    : "reviews"}
                </span>

              </div>

              <div className="reviews-distribution">

                {[5, 4, 3, 2, 1].map(
                  (star) => (
                    <div
                      className="rating-bar-row"
                      key={star}
                    >

                      <span>
                        {star}
                      </span>

                      <Star
                        size={13}
                        fill="currentColor"
                      />

                      <div className="rating-bar">

                        <div
                          className="rating-bar-fill"
                          style={{
                            width: `${getRatingPercentage(
                              star
                            )}%`,
                          }}
                        />

                      </div>

                      <small>
                        {getRatingCount(
                          star
                        )}
                      </small>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

          {/* WRITE REVIEW */}

          <div className="review-action-card">

            <div className="review-action-content">

              <div className="review-action-icon">

                <Star
                  size={22}
                  fill="currentColor"
                />

              </div>

              <div>

                <h3>
                  Have you used this product?
                </h3>

                <p>
                  Share your experience and
                  help other customers.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="open-review-button"
              onClick={
                openReviewModal
              }
            >
              <Star size={17} />

              Write a Review
            </button>

          </div>

          {/* LOGIN / GENERAL ERROR */}

          {reviewError &&
            !showReviewModal && (
              <div className="review-page-error">
                {reviewError}
              </div>
            )}

          {/* REVIEWS LIST */}

          <div className="reviews-list-section">

            <div className="reviews-list-header">

              <div>

                <h3>
                  Customer Reviews
                </h3>

                <p>
                  Real experiences from
                  HoneyTerra customers
                </p>

              </div>

              <span>
                {totalReviews}{" "}
                {totalReviews === 1
                  ? "review"
                  : "reviews"}
              </span>

            </div>

            {reviewsLoading ? (
              <div className="reviews-loading">

                <div className="reviews-spinner"></div>

                <p>
                  Loading reviews...
                </p>

              </div>
            ) : reviews.length === 0 ? (
              <div className="no-reviews">

                <div className="no-reviews-icon">
                  <Star size={28} />
                </div>

                <h3>
                  No Reviews Yet
                </h3>

                <p>
                  Be the first customer to
                  review this product.
                </p>

              </div>
            ) : (
              <div className="reviews-list">

                {reviews.map(
                  (review) => (
                    <article
                      className="review-card"
                      key={review._id}
                    >

                      <div className="review-card-top">

                        <div className="review-user">

                          <div className="review-user-avatar">

                            {review.user?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              review.user?.email
                                ?.charAt(0)
                                ?.toUpperCase() ||
                              "C"}

                          </div>

                          <div className="review-user-info">

                            <strong>
                              {getReviewUserName(
                                review
                              )}
                            </strong>

                            <span>
                              {formatReviewDate(
                                review.createdAt
                              )}
                            </span>

                          </div>

                        </div>

                        <div className="review-card-rating">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                size={15}
                                fill={
                                  star <=
                                  Number(
                                    review.rating
                                  )
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            )
                          )}

                        </div>

                      </div>

                      <p className="review-card-text">

                        {review.comment ||
                          review.description ||
                          review.review ||
                          ""}

                      </p>

                      {review.image && (
                        <div className="review-card-image">

                          <img
                            src={review.image}
                            alt="Customer review"
                          />

                        </div>
                      )}

                      {review.isVerified && (
                        <span className="review-verified">

                          <Check size={11} />

                          Verified Purchase

                        </span>
                      )}

                      {review.isOwner && (
                        <button
                          type="button"
                          className="delete-review-button"
                          onClick={() =>
                            handleDeleteReview(
                              review._id
                            )
                          }
                        >

                          <Trash2 size={14} />

                          Delete Review

                        </button>
                      )}

                    </article>
                  )
                )}

              </div>
            )}

          </div>

        </div>

      </section>

      {/* ==========================================
          REVIEW MODAL
      ========================================== */}

      {showReviewModal && (
        <div
          className="review-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeReviewModal();
            }
          }}
        >

          <div className="review-modal">

            {/* MODAL HEADER */}

            <div className="review-modal-header">

              <div>

                <span>
                  CUSTOMER FEEDBACK
                </span>

                <h2>
                  Write a Review
                </h2>

                <p>
                  Share your experience with{" "}
                  <strong>
                    {name}
                  </strong>
                </p>

              </div>

              <button
                type="button"
                className="review-modal-close"
                onClick={
                  closeReviewModal
                }
                disabled={
                  submittingReview
                }
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              className="review-form"
              onSubmit={
                handleSubmitReview
              }
            >

              {/* STAR RATING */}

              <div className="review-rating-field">

                <label>
                  Your Rating
                </label>

                <div className="review-rating-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        className={
                          star <=
                          (hoverRating ||
                            rating)
                            ? "review-star-button active"
                            : "review-star-button"
                        }
                        onMouseEnter={() =>
                          setHoverRating(
                            star
                          )
                        }
                        onMouseLeave={() =>
                          setHoverRating(
                            0
                          )
                        }
                        onClick={() =>
                          setRating(
                            star
                          )
                        }
                      >

                        <Star
                          size={30}
                          fill={
                            star <=
                            (hoverRating ||
                              rating)
                              ? "currentColor"
                              : "none"
                          }
                        />

                      </button>
                    )
                  )}

                </div>

                {rating > 0 && (
                  <span className="selected-rating-text">

                    {rating === 5 &&
                      "Excellent!"}

                    {rating === 4 &&
                      "Very Good!"}

                    {rating === 3 &&
                      "Good!"}

                    {rating === 2 &&
                      "Could be better"}

                    {rating === 1 &&
                      "Poor"}

                  </span>
                )}

              </div>

              {/* REVIEW TEXT */}

              <div className="review-text-field">

                <label htmlFor="review">
                  Your Review
                </label>

                <textarea
                  id="review"
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(
                      event.target.value
                    )
                  }
                  placeholder="Tell us about your experience with this product..."
                  rows={5}
                  maxLength={1000}
                />

                <small>
                  {reviewText.length}/1000
                </small>

              </div>

              {/* IMAGE */}

              <div className="review-image-field">

                <label>
                  Add a Photo{" "}
                  <span>
                    (Optional)
                  </span>
                </label>

                {!reviewImagePreview ? (
                  <label className="review-upload-box">

                    <Camera size={25} />

                    <strong>
                      Upload Product Photo
                    </strong>

                    <span>
                      JPG, PNG or WEBP · Max 5MB
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleReviewImageChange
                      }
                    />

                  </label>
                ) : (
                  <div className="review-image-preview">

                    <img
                      src={
                        reviewImagePreview
                      }
                      alt="Review preview"
                    />

                    <button
                      type="button"
                      onClick={
                        removeReviewImage
                      }
                      aria-label="Remove image"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                )}

              </div>

              {/* ERROR */}

              {reviewError && (
                <div className="review-form-error">
                  {reviewError}
                </div>
              )}

              {/* SUCCESS */}

              {reviewSuccess && (
                <div className="review-form-success">

                  <Check size={17} />

                  {reviewSuccess}

                </div>
              )}

              {/* BUTTONS */}

              <div className="review-modal-actions">

                <button
                  type="button"
                  className="cancel-review-button"
                  onClick={
                    closeReviewModal
                  }
                  disabled={
                    submittingReview
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-review-button"
                  disabled={
                    submittingReview
                  }
                >

                  {submittingReview ? (
                    <>
                      <span className="review-submit-spinner"></span>

                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={17} />

                      Submit Review
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}

export default ProductDetails;
