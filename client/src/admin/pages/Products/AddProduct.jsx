import React, { useState } from "react";
import axios from "axios";
import "./products.css";

const AddProduct = () => {
  // ==========================================
  // FORM DATA
  // ==========================================

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

  // ==========================================
  // VARIANTS
  // ==========================================

  const [variants, setVariants] = useState([]);

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================

  const [images, setImages] = useState([]);

  // ==========================================
  // IMAGE PREVIEWS
  // ==========================================

  const [imagePreviews, setImagePreviews] = useState([]);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // MESSAGE
  // ==========================================

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // ==========================================
  // HANDLE NORMAL INPUT
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
  // HANDLE IMAGE SELECTION
  // ==========================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    // ==========================================
    // MAX 10 IMAGES
    // ==========================================

    if (images.length + selectedFiles.length > 10) {
      setMessage({
        type: "error",
        text: "You can upload maximum 10 images.",
      });

      e.target.value = "";
      return;
    }

    // ==========================================
    // ALLOWED IMAGE TYPES
    // ==========================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    // ==========================================
    // VALIDATE FILES
    // ==========================================

    const validFiles = [];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text:
            "Only JPG, JPEG, PNG, WEBP and GIF images are allowed.",
        });

        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: `${file.name} is larger than 5 MB.`,
        });

        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // ==========================================
    // ADD FILES
    // ==========================================

    setImages((prev) => [
      ...prev,
      ...validFiles,
    ]);

    // ==========================================
    // CREATE PREVIEWS
    // ==========================================

    const newPreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    // ==========================================
    // CLEAR FILE INPUT
    // ==========================================

    e.target.value = "";

    setMessage({
      type: "",
      text: "",
    });
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = (index) => {
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // SUBMIT PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!formData.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter product name.",
      });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({
        type: "error",
        text: "Please enter product description.",
      });
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid selling price.",
      });
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      setMessage({
        type: "error",
        text: "Please enter valid stock.",
      });
      return;
    }

    if (images.length === 0) {
      setMessage({
        type: "error",
        text: "Please upload at least one product image.",
      });
      return;
    }

    // ==========================================
    // VALIDATE VARIANTS
    // ==========================================

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      if (!variant.name.trim()) {
        setMessage({
          type: "error",
          text: `Please enter a name for Variant ${i + 1}.`,
        });
        return;
      }

      if (
        variant.price === "" ||
        Number(variant.price) <= 0
      ) {
        setMessage({
          type: "error",
          text: `Please enter a valid price for Variant ${i + 1}.`,
        });
        return;
      }

      if (
        variant.stock === "" ||
        Number(variant.stock) < 0
      ) {
        setMessage({
          type: "error",
          text: `Please enter valid stock for Variant ${i + 1}.`,
        });
        return;
      }
    }

    setLoading(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      // ==========================================
      // GET TOKEN
      // ==========================================

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({
          type: "error",
          text: "Admin session expired. Please login again.",
        });

        setLoading(false);
        return;
      }

      // ==========================================
      // CREATE FORMDATA
      // ==========================================

      const data = new FormData();

      // ==========================================
      // BASIC INFORMATION
      // ==========================================

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "price",
        String(Number(formData.price))
      );

      data.append(
        "compareAtPrice",
        String(
          Number(formData.compareAtPrice) || 0
        )
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "stock",
        String(Number(formData.stock) || 0)
      );

      data.append(
        "isActive",
        String(formData.isActive)
      );

      data.append(
        "isFeatured",
        String(formData.isFeatured)
      );

      // ==========================================
      // VARIANTS
      // ==========================================

      const formattedVariants = variants.map(
        (variant) => ({
          name: variant.name.trim(),

          price:
            Number(variant.price) || 0,

          compareAtPrice:
            Number(variant.compareAtPrice) || 0,

          stock:
            Number(variant.stock) || 0,

          sku:
            variant.sku.trim(),
        })
      );

      data.append(
        "variants",
        JSON.stringify(formattedVariants)
      );

      // ==========================================
      // IMAGES
      // ==========================================

      images.forEach((image) => {
        data.append("images", image);
      });

      // ==========================================
      // DEBUG
      // ==========================================

      console.log("========== CREATE PRODUCT ==========");
      console.log("Product:", formData);
      console.log("Variants:", formattedVariants);
      console.log("Images:", images);
      console.log("Token exists:", !!token);
      console.log("====================================");

      // ==========================================
      // SEND REQUEST
      // ==========================================

      const response = await axios.post(
        "http://localhost:3000/api/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      console.log(
        "Create Product Response:",
        response.data
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Product created successfully!",
        });

        // ==========================================
        // RESET FORM
        // ==========================================

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

        // ==========================================
        // REVOKE IMAGE PREVIEWS
        // ==========================================

        imagePreviews.forEach((preview) => {
          URL.revokeObjectURL(preview);
        });

        setImages([]);
        setImagePreviews([]);

        // ==========================================
        // SCROLL TO TOP
        // ==========================================

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error(
        "Create Product Error:",
        error
      );

      // ==========================================
      // NETWORK ERROR
      // ==========================================

      if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        setMessage({
          type: "error",
          text:
            "Cannot connect to backend server. Make sure your Node.js server is running on port 3000.",
        });

        return;
      }

      // ==========================================
      // UNAUTHORIZED
      // ==========================================

      if (error.response?.status === 401) {
        setMessage({
          type: "error",
          text:
            "Unauthorized. Please login to the admin account again.",
        });

        return;
      }

      // ==========================================
      // FORBIDDEN
      // ==========================================

      if (error.response?.status === 403) {
        setMessage({
          type: "error",
          text:
            "Access denied. Only admin can create products.",
        });

        return;
      }

      // ==========================================
      // SERVER ERROR
      // ==========================================

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

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

          <h1>
            Add New Product
          </h1>

          <p>
            Add a new product to your HoneyTerra store.
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

      {/* =====================================
          FORM
      ===================================== */}

      <form
        onSubmit={handleSubmit}
        className="admin-product-form"
      >

        {/* =====================================
            BASIC INFORMATION
        ===================================== */}

        <div className="product-form-card">

          <div className="product-form-card-header">
            <h2>
              Basic Information
            </h2>

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
            <h2>
              Pricing
            </h2>

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
            OPTIONAL VARIANTS
        ===================================== */}

        <div className="product-form-card">

          <div className="product-form-card-header product-form-flex-header">

            <div>
              <h2>
                Product Variants
              </h2>

              <p>
                Optional. Add different sizes, packs or versions.
              </p>
            </div>

            <button
              type="button"
              className="admin-primary-button add-variant-button"
              onClick={addVariant}
            >
              <span>
                +
              </span>

              Add Variant
            </button>

          </div>

          {/* NO VARIANTS */}

          {variants.length === 0 ? (

            <div className="no-variants">

              <p>
                No variants added yet.
              </p>

              <span>
                Variants are optional. If your product has
                different sizes or packs, click "Add Variant".
              </span>

            </div>

          ) : (

            <div className="variants-container">

              {variants.map((variant, index) => (

                <div
                  className="variant-card"
                  key={`variant-${index}`}
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

                    {/* VARIANT NAME */}

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
                        placeholder="Small / Pack of 3"
                      />

                    </div>

                    {/* VARIANT PRICE */}

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
                      />

                    </div>

                    {/* VARIANT COMPARE PRICE */}

                    <div className="product-form-group">

                      <label>
                        Compare Price (₹)
                      </label>

                      <input
                        type="number"
                        value={variant.compareAtPrice}
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

                    {/* VARIANT STOCK */}

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

            <h2>
              Product Images
            </h2>

            <p>
              Upload actual product images from your computer.
            </p>

          </div>

          {/* IMAGE UPLOAD */}

          <div className="image-upload-area">

            <label
              htmlFor="product-images"
              className="image-upload-label"
            >

              <div className="image-upload-icon">
                +
              </div>

              <strong>
                Choose Product Images
              </strong>

              <span>
                JPG, JPEG, PNG, WEBP or GIF
              </span>

              <small>
                Maximum 10 images, 5 MB each
              </small>

            </label>

            <input
              id="product-images"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageChange}
              style={{
                display: "none",
              }}
            />

          </div>

          {/* IMAGE PREVIEWS */}

          {imagePreviews.length > 0 && (

            <div className="product-images-preview">

              {imagePreviews.map((preview, index) => (

                <div
                  className="product-image-item"
                  key={`preview-${index}`}
                >

                  <img
                    src={preview}
                    alt={`Product ${index + 1}`}
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

                  <span>
                    Image {index + 1}
                  </span>

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

            <h2>
              Product Settings
            </h2>

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
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button product-submit-button"
            disabled={loading}
          >
            {loading
              ? "Uploading & Creating..."
              : "Create Product"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddProduct;