import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// ==========================================
// GET ADMIN DASHBOARD STATS
// ==========================================

export const getDashboardStats = async (req, res) => {
  try {
    // ==========================================
    // TOTAL ORDERS
    // ==========================================

    const totalOrders = await Order.countDocuments();

    // ==========================================
    // TOTAL CUSTOMERS
    // ==========================================

    const totalCustomers = await User.countDocuments({
      role: "user",
    });

    // ==========================================
    // TOTAL PRODUCTS
    // ==========================================

    const totalProducts = await Product.countDocuments();

    // ==========================================
    // TOTAL SALES
    // ==========================================
    // Cancelled orders are excluded from sales

    const salesResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    // ==========================================
    // RECENT ORDERS
    // ==========================================

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate(
        "items.product",
        "name images price category"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================================
    // PRODUCT INVENTORY
    // ==========================================

    const products = await Product.find()
      .select(
        "name price stock images category isActive"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      stats: {
        totalSales,
        totalOrders,
        totalCustomers,
        totalProducts,
      },

      recentOrders,

      products,
    });
  } catch (error) {
    console.error(
      "Get Dashboard Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};