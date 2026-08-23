import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ==========================================
// GET MY CART
// ==========================================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items.product",
      select:
        "name slug price compareAtPrice images category stock isActive",
    });

    // Create empty cart if user doesn't have one
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
    });
  }
};

// ==========================================
// ADD PRODUCT TO CART
// ==========================================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const requestedQuantity = Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find product
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // Check whether product already exists
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId.toString()
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + requestedQuantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
    } else {
      if (requestedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        });
      }

      cart.items.push({
        product: product._id,
        quantity: requestedQuantity,
        price: product.price,
      });
    }

    calculateCartTotals(cart);

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price compareAtPrice images category stock isActive",
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while adding product to cart",
    });
  }
};

// ==========================================
// UPDATE CART ITEM QUANTITY
// ==========================================
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const newQuantity = Number(quantity);

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    item.quantity = newQuantity;
    item.price = product.price;

    calculateCartTotals(cart);

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price compareAtPrice images category stock isActive",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating cart",
    });
  }
};

// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) =>
        item.product.toString() === productId.toString()
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId.toString()
    );

    calculateCartTotals(cart);

    await cart.save();

    await cart.populate({
      path: "items.product",
      select:
        "name slug price compareAtPrice images category stock isActive",
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove From Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while removing product",
    });
  }
};

// ==========================================
// CLEAR CART
// ==========================================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while clearing cart",
    });
  }
};

// ==========================================
// CALCULATE CART TOTALS
// ==========================================
const calculateCartTotals = (cart) => {
  let totalItems = 0;
  let totalAmount = 0;

  cart.items.forEach((item) => {
    totalItems += item.quantity;

    totalAmount +=
      item.price * item.quantity;
  });

  cart.totalItems = totalItems;
  cart.totalAmount = Number(
    totalAmount.toFixed(2)
  );
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};