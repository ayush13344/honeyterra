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
      images,
      stock,
      isActive,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price and category are required",
      });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({
      name: name.trim(),
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this name already exists",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      compareAtPrice: Number(compareAtPrice) || 0,
      category,
      images: Array.isArray(images) ? images : [],
      stock: Number(stock) || 0,
      isActive:
        isActive !== undefined ? isActive : true,
      isFeatured:
        isFeatured !== undefined ? isFeatured : false,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating product",
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

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category
    if (category) {
      filter.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Featured
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Pagination
    const currentPage = Math.max(Number(page), 1);
    const productsPerPage = Math.min(
      Math.max(Number(limit), 1),
      50
    );

    const skip =
      (currentPage - 1) * productsPerPage;

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;

      case "price-high":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(productsPerPage);

    const totalProducts =
      await Product.countDocuments(filter);

    const totalPages = Math.ceil(
      totalProducts / productsPerPage
    );

    res.status(200).json({
      success: true,
      products,

      pagination: {
        currentPage,
        productsPerPage,
        totalProducts,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
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

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};

// ==========================================
// UPDATE PRODUCT - ADMIN
// ==========================================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

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
      images,
      stock,
      isActive,
      isFeatured,
    } = req.body;

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (compareAtPrice !== undefined) {
      product.compareAtPrice =
        Number(compareAtPrice);
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (images !== undefined) {
      product.images = Array.isArray(images)
        ? images
        : [];
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating product",
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

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

// ==========================================
// GET ALL PRODUCTS - ADMIN
// ==========================================
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get Admin Products Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAdminProducts,
};