import React, { useEffect, useState } from "react";
import {
  Star,
  Camera,
  UserRound,
  Trash2,
  Edit3,
  X,
  ImagePlus,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Reviews.css";

const API_URL = "http://localhost:3000";

function Reviews({ productId }) {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] =
    useState({
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] =
    useState("");

  const [editingReview, setEditingReview] =
    useState(null);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH REVIEWS
  // ==========================================

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/reviews/product/${productId}`
      );

      const data = await response.json();

      console.log(
        "Reviews API Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch reviews"
        );
      }

      setReviews(data.reviews || []);

      setAverageRating(
        Number(data.averageRating || 0)
      );

      setRatingBreakdown(
        data.ratingBreakdown || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        }
      );
    } catch (error) {
      console.error(
        "Fetch Reviews Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle("");
    setComment("");
    setImage(null);
    setImagePreview("");
    setEditingReview(null);
    setShowForm(false);
  };

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Image size should be less than 5MB."
      );
      return;
    }

    setImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ==========================================
  // SUBMIT REVIEW
  // ==========================================

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      alert(
        "Please write something about the product."
      );
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append(
        "productId",
        productId
      );

      formData.append(
        "rating",
        rating
      );

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "comment",
        comment.trim()
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      const url = editingReview
        ? `${API_URL}/api/reviews/${editingReview._id}`
        : `${API_URL}/api/reviews`;

      const method = editingReview
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log(
        "Submit Review Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit review"
        );
      }

      alert(
        editingReview
          ? "Review updated successfully."
          : "Review submitted successfully."
      );

      resetForm();

      await fetchReviews();
    } catch (error) {
      console.error(
        "Submit Review Error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // EDIT REVIEW
  // ==========================================

  const handleEdit = (review) => {
    setEditingReview(review);

    setRating(review.rating || 0);

    setTitle(review.title || "");

    setComment(review.comment || "");

    setImage(null);

    setImagePreview(review.image || "");

    setShowForm(true);

    window.scrollTo({
      top:
        document.querySelector(
          ".reviews-section"
        )?.offsetTop - 100 || 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDelete = async (reviewId) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

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
    } catch (error) {
      console.error(
        "Delete Review Error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete review."
      );
    }
  };

  // ==========================================
  // CHECK CURRENT USER
  // ==========================================

  const getCurrentUser = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) return null;

      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // ==========================================
  // CHECK REVIEW OWNER
  // ==========================================

  const isOwnReview = (review) => {
    if (!currentUser) return false;

    const currentUserId =
      currentUser._id ||
      currentUser.id;

    const reviewUserId =
      review.user?._id ||
      review.user?.id ||
      review.user;

    return (
      currentUserId &&
      reviewUserId &&
      String(currentUserId) ===
        String(reviewUserId)
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // STAR COMPONENT
  // ==========================================

  const StarRating = ({
    value,
    interactive = false,
    size = 20,
  }) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map(
          (star) => {
            const filled =
              interactive
                ? star <=
                  (hoverRating ||
                    rating)
                : star <= value;

            return (
              <button
                key={star}
                type="button"
                className={`review-star-btn ${
                  filled
                    ? "review-star-filled"
                    : ""
                } ${
                  interactive
                    ? "review-star-interactive"
                    : "review-star-static"
                }`}
                onClick={
                  interactive
                    ? () =>
                        setRating(star)
                    : undefined
                }
                onMouseEnter={
                  interactive
                    ? () =>
                        setHoverRating(
                          star
                        )
                    : undefined
                }
                onMouseLeave={
                  interactive
                    ? () =>
                        setHoverRating(
                          0
                        )
                    : undefined
                }
                aria-label={
                  interactive
                    ? `${star} star`
                    : undefined
                }
              >
                <Star
                  size={size}
                  fill={
                    filled
                      ? "currentColor"
                      : "none"
                  }
                  strokeWidth={1.8}
                />
              </button>
            );
          }
        )}
      </div>
    );
  };

  // ==========================================
  // TOTAL REVIEWS
  // ==========================================

  const totalReviews = reviews.length;

  // ==========================================
  // RATING PERCENTAGE
  // ==========================================

  const getRatingPercentage = (star) => {
    if (!totalReviews) return 0;

    return Math.round(
      (ratingBreakdown[star] /
        totalReviews) *
        100
    );
  };

  return (
    <section className="reviews-section">
      <div className="reviews-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="reviews-header">
          <div>
            <span className="reviews-eyebrow">
              CUSTOMER FEEDBACK
            </span>

            <h2>Reviews & Ratings</h2>

            <p>
              See what other customers think
              about this product.
            </p>
          </div>

          <button
            className="write-review-btn"
            onClick={() => {
              const token = getToken();

              if (!token) {
                navigate("/login");
                return;
              }

              setShowForm(true);
            }}
          >
            <MessageSquare
              size={17}
            />

            Write a Review
          </button>
        </div>

        {/* ==========================================
            RATING SUMMARY
        ========================================== */}

        <div className="reviews-summary">

          <div className="reviews-average">
            <strong>
              {averageRating.toFixed(1)}
            </strong>

            <StarRating
              value={averageRating}
              size={19}
            />

            <span>
              Based on{" "}
              {totalReviews}{" "}
              {totalReviews === 1
                ? "review"
                : "reviews"}
            </span>
          </div>

          <div className="reviews-breakdown">
            {[5, 4, 3, 2, 1].map(
              (star) => (
                <div
                  className="rating-breakdown-row"
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
                    {
                      ratingBreakdown[
                        star
                      ]
                    }
                  </small>
                </div>
              )
            )}
          </div>
        </div>

        {/* ==========================================
            REVIEW FORM
        ========================================== */}

        {showForm && (
          <div className="review-form-card">

            <div className="review-form-header">
              <div>
                <span>
                  {editingReview
                    ? "EDIT REVIEW"
                    : "YOUR EXPERIENCE"}
                </span>

                <h3>
                  {editingReview
                    ? "Update your review"
                    : "Share your experience"}
                </h3>
              </div>

              <button
                type="button"
                className="close-review-form"
                onClick={resetForm}
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmitReview
              }
            >

              {/* Rating */}

              <div className="review-form-group">
                <label>
                  Your Rating
                </label>

                <div className="form-rating-area">
                  <StarRating
                    value={rating}
                    interactive
                    size={30}
                  />

                  <span>
                    {rating === 0
                      ? "Select a rating"
                      : `${rating} out of 5`}
                  </span>
                </div>
              </div>

              {/* Title */}

              <div className="review-form-group">
                <label htmlFor="review-title">
                  Review Title
                </label>

                <input
                  id="review-title"
                  type="text"
                  placeholder="Give your review a title"
                  value={title}
                  maxLength={100}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Comment */}

              <div className="review-form-group">
                <label htmlFor="review-comment">
                  Your Review
                </label>

                <textarea
                  id="review-comment"
                  rows="5"
                  placeholder="Tell us about your experience with this product..."
                  value={comment}
                  maxLength={1000}
                  onChange={(event) =>
                    setComment(
                      event.target.value
                    )
                  }
                />

                <small className="review-character-count">
                  {comment.length}/1000
                </small>
              </div>

              {/* Image */}

              <div className="review-form-group">
                <label>
                  Product Photo
                  <span>
                    {" "}
                    (optional)
                  </span>
                </label>

                {!imagePreview ? (
                  <label className="review-upload-box">
                    <ImagePlus
                      size={25}
                    />

                    <strong>
                      Add a photo
                    </strong>

                    <span>
                      JPG, PNG or WEBP ·
                      Max 5MB
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                    />
                  </label>
                ) : (
                  <div className="review-image-preview">
                    <img
                      src={imagePreview}
                      alt="Review preview"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}

              <div className="review-form-actions">
                <button
                  type="button"
                  className="review-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="review-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={17}
                        className="review-spinner"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <MessageSquare
                        size={17}
                      />

                      {editingReview
                        ? "Update Review"
                        : "Submit Review"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==========================================
            REVIEWS LIST
        ========================================== */}

        <div className="reviews-list">

          <div className="reviews-list-heading">
            <h3>
              Customer Reviews
            </h3>

            <span>
              {totalReviews}{" "}
              {totalReviews === 1
                ? "review"
                : "reviews"}
            </span>
          </div>

          {loading ? (
            <div className="reviews-loading">
              <Loader2
                size={28}
                className="review-spinner"
              />

              <p>
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              <div>
                <MessageSquare
                  size={30}
                />
              </div>

              <h3>
                No reviews yet
              </h3>

              <p>
                Be the first to share
                your experience with
                this product.
              </p>

              <button
                onClick={() => {
                  const token =
                    getToken();

                  if (!token) {
                    navigate(
                      "/login"
                    );
                    return;
                  }

                  setShowForm(true);
                }}
              >
                Write the first review
              </button>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                className="review-item"
                key={review._id}
              >

                {/* User */}

                <div className="review-user">
                  <div className="review-avatar">
                    <UserRound
                      size={19}
                    />
                  </div>

                  <div>
                    <strong>
                      {review.user
                        ?.name ||
                        "Customer"}
                    </strong>

                    <div className="review-user-meta">
                      <span>
                        Verified
                        Purchase
                      </span>

                      <i>•</i>

                      <span>
                        {formatDate(
                          review.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}

                <div className="review-rating-row">
                  <StarRating
                    value={
                      review.rating
                    }
                    size={16}
                  />
                </div>

                {/* Content */}

                {review.title && (
                  <h4>
                    {review.title}
                  </h4>
                )}

                <p className="review-comment">
                  {review.comment}
                </p>

                {/* Image */}

                {review.image && (
                  <div className="review-photo">
                    <img
                      src={review.image}
                      alt="Customer product review"
                    />
                  </div>
                )}

                {/* Actions */}

                {isOwnReview(
                  review
                ) && (
                  <div className="review-item-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          review
                        )
                      }
                    >
                      <Edit3
                        size={14}
                      />

                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          review._id
                        )
                      }
                    >
                      <Trash2
                        size={14}
                      />

                      Delete
                    </button>

                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Reviews;