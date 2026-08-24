import { useEffect, useState } from "react";
import "./ProductGallery.css";

function ProductGallery({ images = [] }) {
  // ==========================================
  // PREPARE IMAGES
  // ==========================================

  const safeImages = Array.isArray(images)
    ? images
    : [];

  // ==========================================
  // SELECTED IMAGE
  // ==========================================

  const [selectedImage, setSelectedImage] = useState(
    safeImages.length > 0 ? safeImages[0] : null
  );

  // ==========================================
  // UPDATE SELECTED IMAGE WHEN IMAGES CHANGE
  // ==========================================

  useEffect(() => {
    if (safeImages.length > 0) {
      setSelectedImage(safeImages[0]);
    } else {
      setSelectedImage(null);
    }
  }, [images]);

  // ==========================================
  // NO IMAGES
  // ==========================================

  if (safeImages.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main">
          <div className="gallery-placeholder">
            <span>Product Image</span>
            <small>No image available</small>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="product-gallery">

      {/* ======================================
          MAIN IMAGE
      ====================================== */}

      <div className="product-gallery-main">

        {selectedImage?.src ? (
          <img
            src={selectedImage.src}
            alt={selectedImage.name || "Product image"}
          />
        ) : (
          <div className="gallery-placeholder">

            <span>
              Product Image
            </span>

            <small>
              {selectedImage?.name || "Product image"}
            </small>

          </div>
        )}

      </div>

      {/* ======================================
          THUMBNAILS
      ====================================== */}

      <div className="product-gallery-thumbnails">

        {safeImages.map((image, index) => {

          // Create a guaranteed unique key
          const imageKey =
            image.id ||
            image._id ||
            image.public_id ||
            image.src ||
            `product-image-${index}`;

          return (
            <button
              key={imageKey}
              type="button"
              className={`gallery-thumbnail ${
                selectedImage &&
                (
                  selectedImage.id === image.id ||
                  selectedImage._id === image._id ||
                  selectedImage.src === image.src
                )
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedImage(image)
              }
            >

              {image.src ? (
                <img
                  src={image.src}
                  alt={
                    image.name ||
                    `Product image ${index + 1}`
                  }
                />
              ) : (
                <span>
                  {image.name ||
                    `Image ${index + 1}`}
                </span>
              )}

            </button>
          );
        })}

      </div>

    </div>
  );
}

export default ProductGallery;