import React, { useState } from "react";
import axios from "axios";
import "./products.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "Gel Ash Trays",
    stock: "",
    isActive: true,
    isFeatured: false,
  });

  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // ADD VARIANT
  // ==========================================
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        price: "",
        compareAtPrice: "",
        stock: "",
        sku: "",
      },
    ]);
  };

  // ==========================================
  // UPDATE VARIANT
  // ==========================================
  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  // ==========================================
  // REMOVE VARIANT
  // ==========================================
  const removeVariant = (index) => {
    setVariants((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // ADD IMAGE
  // ==========================================
  const addImage = () => {
    if (!imageUrl.trim()) return;

    setImages((prev) => [
      ...prev,
      imageUrl.trim(),
    ]);

    setImageUrl("");
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================
  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // SUBMIT PRODUCT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const token = localStorage.getItem("token");

      const productData = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        price: Number(formData.price),

        compareAtPrice:
          Number(formData.compareAtPrice) || 0,

        category: formData.category,

        stock: Number(formData.stock) || 0,

        variants: variants.map((variant) => ({
          name: variant.name.trim(),

          price: Number(variant.price) || 0,

          compareAtPrice:
            Number(variant.compareAtPrice) || 0,

          stock:
            Number(variant.stock) || 0,

          sku: variant.sku.trim(),
        })),

        images,

        isActive: formData.isActive,

        isFeatured: formData.isFeatured,
      };

      const response = await axios.post(
        "http://localhost:5000/api/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Product created successfully!",
        });

        setFormData({
          name: "",
          description: "",
          price: "",
          compareAtPrice: "",
          category: "Gel Ash Trays",
          stock: "",
          isActive: true,
          isFeatured: false,
        });

        setVariants([]);
        setImages([]);
        setImageUrl("");
      }
    } catch (error) {
      console.error(
        "Create Product Error:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}
      <div className="admin-add-product-heading">

        <div>
          <p className="admin-add-product-eyebrow">
            HoneyTerra Admin
          </p>

          <h1>Add New Product</h1>

          <p>
            Add a new product to your HoneyTerra
            store.
          </p>
        </div>

      </div>

      {/* =====================================
          MESSAGE
      ===================================== */}
      {message.text && (
        <div
          className={`product-form-message ${
            message.type === "success"
              ? "success"
              : "error"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="admin-product-form"
      >

        {/* =====================================
            BASIC INFORMATION
        ===================================== */}
        <div className="product-form-card">

          <div className="product-form-card-header">
            <h2>Basic Information</h2>

            <p>
              Enter the basic details of your product.
            </p>
          </div>

          <div className="product-form-grid">

            {/* PRODUCT NAME */}
            <div className="product-form-group full-width">
              <label>
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Premium Gel Ash Tray"
                required
              />
            </div>

            {/* CATEGORY */}
            <div className="product-form-group">
              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Gel Ash Trays">
                  Gel Ash Trays
                </option>

                <option value="Honeycomb Wraps">
                  Honeycomb Wraps
                </option>

                <option value="Bundles">
                  Bundles
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>
            </div>

            {/* STOCK */}
            <div className="product-form-group">
              <label>
                Total Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="0"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="product-form-group full-width">
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="5"
                required
              />
            </div>

          </div>
        </div>

        {/* =====================================
            PRICING
        ===================================== */}
        <div className="product-form-card">

          <div className="product-form-card-header">
            <h2>Pricing</h2>

            <p>
              Set the selling price and original price.
            </p>
          </div>

          <div className="product-form-grid">

            {/* SELLING PRICE */}
            <div className="product-form-group">
              <label>
                Selling Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder="499"
                required
              />
            </div>

            {/* COMPARE PRICE */}
            <div className="product-form-group">
              <label>
                Compare At Price (₹)
              </label>

              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                min="0"
                placeholder="699"
              />
            </div>

          </div>
        </div>

        {/* =====================================
            VARIANTS
        ===================================== */}
        <div className="product-form-card">

          <div className="product-form-card-header product-form-flex-header">

            <div>
              <h2>Product Variants</h2>

              <p>
                Add different sizes, packs or versions.
              </p>
            </div>

            <button
              type="button"
              className="admin-primary-button add-variant-button"
              onClick={addVariant}
            >
              <span>+</span>
              Add Variant
            </button>

          </div>

          {variants.length === 0 ? (
            <div className="no-variants">
              <p>
                No variants added yet.
              </p>

              <span>
                Click "Add Variant" if this product
                has different sizes, packs or versions.
              </span>
            </div>
          ) : (
            <div className="variants-container">

              {variants.map((variant, index) => (
                <div
                  className="variant-card"
                  key={index}
                >

                  <div className="variant-header">

                    <h3>
                      Variant {index + 1}
                    </h3>

                    <button
                      type="button"
                      className="remove-variant-button"
                      onClick={() =>
                        removeVariant(index)
                      }
                    >
                      Remove
                    </button>

                  </div>

                  <div className="variant-grid">

                    {/* NAME */}
                    <div className="product-form-group">
                      <label>
                        Variant Name
                      </label>

                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Small"
                        required
                      />
                    </div>

                    {/* PRICE */}
                    <div className="product-form-group">
                      <label>
                        Price (₹)
                      </label>

                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        placeholder="399"
                        min="0"
                        required
                      />
                    </div>

                    {/* COMPARE PRICE */}
                    <div className="product-form-group">
                      <label>
                        Compare Price (₹)
                      </label>

                      <input
                        type="number"
                        value={
                          variant.compareAtPrice
                        }
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "compareAtPrice",
                            e.target.value
                          )
                        }
                        placeholder="499"
                        min="0"
                      />
                    </div>

                    {/* STOCK */}
                    <div className="product-form-group">
                      <label>
                        Stock
                      </label>

                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "stock",
                            e.target.value
                          )
                        }
                        placeholder="10"
                        min="0"
                        required
                      />
                    </div>

                    {/* SKU */}
                    <div className="product-form-group">
                      <label>
                        SKU
                      </label>

                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "sku",
                            e.target.value
                          )
                        }
                        placeholder="GAT-SM"
                      />
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* =====================================
            PRODUCT IMAGES
        ===================================== */}
        <div className="product-form-card">

          <div className="product-form-card-header">

            <h2>Product Images</h2>

            <p>
              Add image URLs for your product.
            </p>

          </div>

          <div className="image-input-row">

            <input
              type="url"
              value={imageUrl}
              onChange={(e) =>
                setImageUrl(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="https://example.com/product-image.jpg"
            />

            <button
              type="button"
              className="image-add-button"
              onClick={addImage}
            >
              Add Image
            </button>

          </div>

          {images.length > 0 && (
            <div className="product-images-preview">

              {images.map((image, index) => (
                <div
                  className="product-image-item"
                  key={index}
                >

                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="remove-image-button"
                  >
                    ×
                  </button>

                </div>
              ))}

            </div>
          )}
        </div>

        {/* =====================================
            SETTINGS
        ===================================== */}
        <div className="product-form-card">

          <div className="product-form-card-header">

            <h2>Product Settings</h2>

            <p>
              Control how this product appears in your store.
            </p>

          </div>

          <div className="product-settings">

            {/* ACTIVE */}
            <label className="product-setting-row">

              <div>
                <strong>
                  Active Product
                </strong>

                <span>
                  Make this product visible on your store.
                </span>
              </div>

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

            </label>

            {/* FEATURED */}
            <label className="product-setting-row">

              <div>
                <strong>
                  Featured Product
                </strong>

                <span>
                  Show this product in your featured section.
                </span>
              </div>

              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />

            </label>

          </div>
        </div>

        {/* =====================================
            ACTIONS
        ===================================== */}
        <div className="product-form-actions">

          <button
            type="button"
            className="product-cancel-button"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button product-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creating Product..."
              : "Create Product"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default AddProduct;