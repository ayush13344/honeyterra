import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import "./products.css";

const API_URL = "http://localhost:3000";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  // Existing Cloudinary images
  const [existingImages, setExistingImages] = useState([]);

  // Newly selected image files
  const [newImages, setNewImages] = useState([]);

  // Preview URLs for new images
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // ==========================================
  // GET PRODUCT
  // ==========================================

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      /*
       * We use the admin products endpoint because the
       * public /:id endpoint only returns active products.
       *
       * The admin endpoint already returns every product.
       */
      const response = await axios.get(
        `${API_URL}/api/products/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const products = response.data?.products || [];

      const product = products.find(
        (item) => item._id === id
      );

      if (!product) {
        setError("Product not found.");
        return;
      }

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        compareAtPrice: product.compareAtPrice ?? "",
        category: product.category || "Gel Ash Trays",
        stock: product.stock ?? "",
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
      });

      setVariants(
        Array.isArray(product.variants)
          ? product.variants.map((variant) => ({
              _id: variant._id,
              name: variant.name || "",
              price: variant.price ?? "",
              compareAtPrice:
                variant.compareAtPrice ?? "",
              stock: variant.stock ?? "",
              sku: variant.sku || "",
            }))
          : []
      );

      setExistingImages(
        Array.isArray(product.images)
          ? product.images
          : []
      );
    } catch (err) {
      console.error("Fetch Product Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
        return;
      }

      if (err.response?.status === 403) {
        setError(
          "You do not have permission to edit products."
        );
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // VARIANTS
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

  const removeVariant = (index) => {
    setVariants((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // EXISTING IMAGE
  // ==========================================

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // NEW IMAGE SELECTION
  // ==========================================

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const validFiles = [];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError(
          `${file.name} is not a supported image format.`
        );
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          `${file.name} is larger than 5MB.`
        );
        continue;
      }

      validFiles.push(file);
    }

    const totalImages =
      existingImages.length +
      newImages.length +
      validFiles.length;

    if (totalImages > 10) {
      setError(
        "A product can have a maximum of 10 images."
      );
      return;
    }

    const updatedFiles = [
      ...newImages,
      ...validFiles,
    ];

    setNewImages(updatedFiles);

    const newPreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setNewImagePreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    // Allows selecting the same file again
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setNewImagePreviews((prev) => {
      const url = prev[index];

      if (url) {
        URL.revokeObjectURL(url);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Product name is required.";
    }

    if (!formData.description.trim()) {
      return "Product description is required.";
    }

    const price = Number(formData.price);

    if (Number.isNaN(price) || price < 0) {
      return "Please enter a valid product price.";
    }

    const stock = Number(formData.stock);

    if (Number.isNaN(stock) || stock < 0) {
      return "Please enter a valid stock quantity.";
    }

    if (
      existingImages.length === 0 &&
      newImages.length === 0
    ) {
      return "At least one product image is required.";
    }

    for (const variant of variants) {
      if (!variant.name.trim()) {
        return "Every variant must have a name.";
      }

      if (
        Number.isNaN(Number(variant.price)) ||
        Number(variant.price) < 0
      ) {
        return `Invalid price for variant "${variant.name}".`;
      }

      if (
        Number.isNaN(Number(variant.stock)) ||
        Number(variant.stock) < 0
      ) {
        return `Invalid stock for variant "${variant.name}".`;
      }
    }

    return null;
  };

  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const data = new FormData();

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
        formData.price
      );

      data.append(
        "compareAtPrice",
        formData.compareAtPrice || "0"
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "stock",
        formData.stock
      );

      data.append(
        "isActive",
        String(formData.isActive)
      );

      data.append(
        "isFeatured",
        String(formData.isFeatured)
      );

      /*
       * Send the variants as JSON because the backend
       * already supports JSON parsing.
       */
      data.append(
        "variants",
        JSON.stringify(
          variants.map((variant) => ({
            ...(variant._id
              ? { _id: variant._id }
              : {}),
            name: variant.name.trim(),
            price: Number(variant.price) || 0,
            compareAtPrice:
              Number(
                variant.compareAtPrice
              ) || 0,
            stock: Number(variant.stock) || 0,
            sku: variant.sku.trim(),
          }))
        )
      );

      /*
       * IMPORTANT:
       * Send the existing images that the admin did NOT remove.
       *
       * The backend will replace product.images with this array,
       * then append newly uploaded Cloudinary images.
       */
      data.append(
        "images",
        JSON.stringify(existingImages)
      );

      // Add newly selected files
      newImages.forEach((file) => {
        data.append("images", file);
      });

      const response = await axios.put(
        `${API_URL}/api/products/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setMessage(
          "Product updated successfully!"
        );

        /*
         * Update the local state from the backend response
         * so the UI reflects the saved product.
         */
        const updatedProduct =
          response.data.product;

        setExistingImages(
          updatedProduct?.images || []
        );

        setNewImages([]);

        newImagePreviews.forEach((url) => {
          URL.revokeObjectURL(url);
        });

        setNewImagePreviews([]);

        /*
         * Go back to product list after a short delay.
         */
        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      } else {
        setError(
          response.data?.message ||
            "Failed to update product."
        );
      }
    } catch (err) {
      console.error(
        "Update Product Error:",
        err
      );

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
        return;
      }

      if (err.response?.status === 403) {
        setError(
          "You do not have permission to update this product."
        );
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CLEANUP PREVIEW URLS
  // ==========================================

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="products-page">
        <div className="product-form-container">
          <div className="product-loading">
            <Loader2
              size={28}
              className="spin"
            />
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !formData.name) {
    return (
      <div className="products-page">
        <div className="product-form-container">
          <div className="product-error">
            <p>{error}</p>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              <ArrowLeft size={18} />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="products-page">
      <div className="product-form-container">
        {/* HEADER */}

        <div className="product-form-header">
          <div>
            <button
              type="button"
              className="back-btn"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              <ArrowLeft size={18} />
              Back to Products
            </button>

            <h1>Edit Product</h1>

            <p>
              Update your product information,
              variants and images.
            </p>
          </div>
        </div>

        {/* MESSAGES */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ======================================
              BASIC INFORMATION
          ====================================== */}

          <section className="product-form-section">
            <div className="section-header">
              <div>
                <h2>Basic Information</h2>
                <p>
                  Update the main product details.
                </p>
              </div>
            </div>

            <div className="form-group">
              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter product description"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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

              <div className="form-group">
                <label>Stock *</label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          {/* ======================================
              PRICING
          ====================================== */}

          <section className="product-form-section">
            <div className="section-header">
              <div>
                <h2>Pricing</h2>
                <p>
                  Set the current and comparison price.
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Price *
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>
                  Compare At Price
                </label>

                <input
                  type="number"
                  name="compareAtPrice"
                  min="0"
                  step="0.01"
                  value={
                    formData.compareAtPrice
                  }
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          {/* ======================================
              VARIANTS
          ====================================== */}

          <section className="product-form-section">
            <div className="section-header">
              <div>
                <h2>Product Variants</h2>
                <p>
                  Manage product variants, pricing,
                  stock and SKU.
                </p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={addVariant}
              >
                <Plus size={17} />
                Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="empty-variants">
                <p>
                  No variants added to this product.
                </p>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={addVariant}
                >
                  <Plus size={17} />
                  Add First Variant
                </button>
              </div>
            ) : (
              <div className="variants-list">
                {variants.map(
                  (variant, index) => (
                    <div
                      className="variant-card"
                      key={
                        variant._id ||
                        `variant-${index}`
                      }
                    >
                      <div className="variant-header">
                        <h3>
                          Variant {index + 1}
                        </h3>

                        <button
                          type="button"
                          className="remove-variant-btn"
                          onClick={() =>
                            removeVariant(index)
                          }
                        >
                          <Trash2 size={17} />
                          Remove
                        </button>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            Variant Name *
                          </label>

                          <input
                            type="text"
                            value={
                              variant.name
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Example: Small"
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            SKU
                          </label>

                          <input
                            type="text"
                            value={
                              variant.sku
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "sku",
                                e.target.value
                              )
                            }
                            placeholder="Example: HT-001"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>
                            Price
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              variant.price
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            Compare At Price
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
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
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            Stock
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={
                              variant.stock
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* ======================================
              PRODUCT IMAGES
          ====================================== */}

          <section className="product-form-section">
            <div className="section-header">
              <div>
                <h2>Product Images</h2>
                <p>
                  Remove existing images or add new
                  images.
                </p>
              </div>
            </div>

            <div className="image-count">
              <ImageIcon size={17} />

              <span>
                {existingImages.length +
                  newImages.length}{" "}
                / 10 images
              </span>
            </div>

            {/* EXISTING IMAGES */}

            {existingImages.length > 0 && (
              <div className="image-grid">
                {existingImages.map(
                  (image, index) => (
                    <div
                      className="image-preview-card"
                      key={`${image}-${index}`}
                    >
                      <img
                        src={image}
                        alt={`Product ${
                          index + 1
                        }`}
                      />

                      <div className="image-label">
                        Existing
                      </div>

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          removeExistingImage(
                            index
                          )
                        }
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {/* NEW IMAGES */}

            {newImagePreviews.length > 0 && (
              <div className="image-grid new-images-grid">
                {newImagePreviews.map(
                  (preview, index) => (
                    <div
                      className="image-preview-card"
                      key={`${preview}-${index}`}
                    >
                      <img
                        src={preview}
                        alt={`New ${
                          index + 1
                        }`}
                      />

                      <div className="image-label new">
                        New
                      </div>

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {/* UPLOAD */}

            {existingImages.length +
              newImages.length <
              10 && (
              <label className="image-upload-box">
                <Upload size={28} />

                <strong>
                  Add Product Images
                </strong>

                <span>
                  JPG, JPEG, PNG, WEBP or GIF
                  • Max 5MB each
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            )}
          </section>

          {/* ======================================
              SETTINGS
          ====================================== */}

          <section className="product-form-section">
            <div className="section-header">
              <div>
                <h2>Product Settings</h2>
                <p>
                  Control product visibility and
                  featured status.
                </p>
              </div>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />

              <span>
                <strong>
                  Active Product
                </strong>

                <small>
                  Customers can see this product
                  on the website.
                </small>
              </span>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isFeatured"
                checked={
                  formData.isFeatured
                }
                onChange={handleChange}
              />

              <span>
                <strong>
                  Featured Product
                </strong>

                <small>
                  Show this product in featured
                  product sections.
                </small>
              </span>
            </label>
          </section>

          {/* ======================================
              ACTIONS
          ====================================== */}

          <div className="product-form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/admin/products")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;