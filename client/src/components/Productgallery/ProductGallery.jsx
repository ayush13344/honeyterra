import { useState } from "react";
import "./ProductGallery.css";

function ProductGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="product-gallery">

      <div className="product-gallery-main">

        {selectedImage.src ? (
          <img
            src={selectedImage.src}
            alt={selectedImage.name}
          />
        ) : (
          <div className="gallery-placeholder">
            <span>Product Image</span>
            <small>
              {selectedImage.name}
            </small>
          </div>
        )}

      </div>

      <div className="product-gallery-thumbnails">

        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            className={`gallery-thumbnail ${
              selectedImage.id === image.id
                ? "active"
                : ""
            }`}
            onClick={() => setSelectedImage(image)}
          >

            {image.src ? (
              <img
                src={image.src}
                alt={image.name}
              />
            ) : (
              <span>{image.id}</span>
            )}

          </button>
        ))}

      </div>

    </div>
  );
}

export default ProductGallery;