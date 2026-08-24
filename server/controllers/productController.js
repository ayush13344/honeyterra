import Product from "../models/Product.js";

// ==========================================
// CREATE PRODUCT - ADMIN
// ==========================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      variants,
      images,
      stock,
      isActive,
      isFeatured,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !name ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price and category are required",
      });
    }

    const productPrice = Number(price);

    if (
      Number.isNaN(productPrice) ||
      productPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Product price must be a valid number",
      });
    }

    // ==========================================
    // CHECK DUPLICATE PRODUCT
    // ==========================================

    const existingProduct = await Product.findOne({
      name: name.trim(),
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this name already exists",
      });
    }

    // ==========================================
    // FORMAT VARIANTS
    // ==========================================

    let formattedVariants = [];

    if (Array.isArray(variants)) {
      formattedVariants = variants.map((variant) => ({
        name: variant.name?.trim() || "",

        price: Number(variant.price) || 0,

        compareAtPrice:
          Number(variant.compareAtPrice) || 0,

        stock: Number(variant.stock) || 0,

        sku: variant.sku?.trim() || "",
      }));
    }

    // ==========================================
    // FORMAT IMAGES
    // ==========================================

    const formattedImages = Array.isArray(images)
      ? images.filter(
          (image) =>
            typeof image === "string" &&
            image.trim() !== ""
        )
      : [];

    // ==========================================
    // CREATE PRODUCT
    // ==========================================

    const product = await Product.create({
      name: name.trim(),

      description: description.trim(),

      price: productPrice,

      compareAtPrice:
        Number(compareAtPrice) || 0,

      category,

      variants: formattedVariants,

      images: formattedImages,

      stock: Number(stock) || 0,

      isActive:
        isActive !== undefined
          ? Boolean(isActive)
          : true,

      isFeatured:
        isFeatured !== undefined
          ? Boolean(isFeatured)
          : false,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating product",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL PRODUCTS - PUBLIC
// ==========================================

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      featured,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {
      isActive: true,
    };

    // ==========================================
    // SEARCH
    // ==========================================

    if (search && search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // ==========================================
    // CATEGORY
    // ==========================================

    if (category && category.trim()) {
      filter.category = category.trim();
    }

    // ==========================================
    // PRICE RANGE
    // ==========================================

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      filter.price = {};

      if (
        minPrice !== undefined &&
        minPrice !== ""
      ) {
        const minimum = Number(minPrice);

        if (!Number.isNaN(minimum)) {
          filter.price.$gte = minimum;
        }
      }

      if (
        maxPrice !== undefined &&
        maxPrice !== ""
      ) {
        const maximum = Number(maxPrice);

        if (!Number.isNaN(maximum)) {
          filter.price.$lte = maximum;
        }
      }
    }

    // ==========================================
    // FEATURED
    // ==========================================

    if (featured === "true") {
      filter.isFeatured = true;
    }

    // ==========================================
    // PAGINATION
    // ==========================================

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const productsPerPage = Math.min(
      Math.max(Number(limit) || 12, 1),
      50
    );

    const skip =
      (currentPage - 1) *
      productsPerPage;

    // ==========================================
    // SORTING
    // ==========================================

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price-low":
        sortOption = {
          price: 1,
        };
        break;

      case "price-high":
        sortOption = {
          price: -1,
        };
        break;

      case "rating":
        sortOption = {
          rating: -1,
        };
        break;

      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    // ==========================================
    // GET PRODUCTS
    // ==========================================

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(productsPerPage);

    // ==========================================
    // COUNT
    // ==========================================

    const totalProducts =
      await Product.countDocuments(filter);

    const totalPages = Math.ceil(
      totalProducts / productsPerPage
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      products,

      pagination: {
        currentPage,
        productsPerPage,
        totalProducts,
        totalPages,

        hasNextPage:
          currentPage < totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get Products Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching products",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT - PUBLIC
// ==========================================

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching product",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PRODUCT - ADMIN
// ==========================================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      variants,
      images,
      stock,
      isActive,
      isFeatured,
    } = req.body;

    // ==========================================
    // NAME
    // ==========================================

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product name cannot be empty",
        });
      }

      product.name = name.trim();
    }

    // ==========================================
    // DESCRIPTION
    // ==========================================

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product description cannot be empty",
        });
      }

      product.description =
        description.trim();
    }

    // ==========================================
    // PRICE
    // ==========================================

    if (price !== undefined) {
      const updatedPrice = Number(price);

      if (
        Number.isNaN(updatedPrice) ||
        updatedPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product price must be a valid number",
        });
      }

      product.price = updatedPrice;
    }

    // ==========================================
    // COMPARE PRICE
    // ==========================================

    if (compareAtPrice !== undefined) {
      product.compareAtPrice =
        Number(compareAtPrice) || 0;
    }

    // ==========================================
    // CATEGORY
    // ==========================================

    if (category !== undefined) {
      product.category = category;
    }

    // ==========================================
    // VARIANTS
    // ==========================================

    if (variants !== undefined) {
      if (!Array.isArray(variants)) {
        return res.status(400).json({
          success: false,
          message:
            "Variants must be an array",
        });
      }

      product.variants = variants.map(
        (variant) => {
          const formattedVariant = {
            name:
              variant.name?.trim() || "",

            price:
              Number(variant.price) || 0,

            compareAtPrice:
              Number(
                variant.compareAtPrice
              ) || 0,

            stock:
              Number(variant.stock) || 0,

            sku:
              variant.sku?.trim() || "",
          };

          if (variant._id) {
            formattedVariant._id =
              variant._id;
          }

          return formattedVariant;
        }
      );
    }

    // ==========================================
    // IMAGES
    // ==========================================

    if (images !== undefined) {
      product.images = Array.isArray(images)
        ? images.filter(
            (image) =>
              typeof image === "string" &&
              image.trim() !== ""
          )
        : [];
    }

    // ==========================================
    // STOCK
    // ==========================================

    if (stock !== undefined) {
      const updatedStock = Number(stock);

      if (
        Number.isNaN(updatedStock) ||
        updatedStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a valid non-negative number",
        });
      }

      product.stock = updatedStock;
    }

    // ==========================================
    // ACTIVE
    // ==========================================

    if (isActive !== undefined) {
      product.isActive =
        Boolean(isActive);
    }

    // ==========================================
    // FEATURED
    // ==========================================

    if (isFeatured !== undefined) {
      product.isFeatured =
        Boolean(isFeatured);
    }

    // ==========================================
    // SAVE
    // ==========================================

    const updatedProduct =
      await product.save();

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating product",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT - ADMIN
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting product",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL PRODUCTS - ADMIN
// ==========================================

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get Admin Products Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching products",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAdminProducts,
};