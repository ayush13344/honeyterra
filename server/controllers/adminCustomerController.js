import User from "../models/User.js";
import Order from "../models/Order.js";

// ==========================================
// GET ALL CUSTOMERS - ADMIN
// ==========================================

export const getAllCustomers = async (req, res) => {
  try {
    // Get all normal users
    const users = await User.find({ role: "user" })
      .select("_id name email phone createdAt")
      .sort({ createdAt: -1 });

    // Get all orders
    const orders = await Order.find({
      user: { $in: users.map((user) => user._id) },
    }).select("user totalAmount orderStatus createdAt");

    // Create customer data
    const customers = users.map((user, index) => {
      const userOrders = orders.filter(
        (order) =>
          order.user &&
          order.user.toString() === user._id.toString()
      );

      // Only count orders that are not cancelled
      const validOrders = userOrders.filter(
        (order) => order.orderStatus !== "cancelled"
      );

      // Calculate total spent
      const totalSpent = validOrders.reduce(
        (total, order) => total + (order.totalAmount || 0),
        0
      );

      return {
        id: `CUS${String(users.length - index).padStart(3, "0")}`,

        _id: user._id,

        name: user.name || "Unknown",

        email: user.email || "",

        phone: user.phone || "Not provided",

        orders: validOrders.length,

        spent: totalSpent,

        joined: user.createdAt,
      };
    });

    // ==========================================
    // STATS
    // ==========================================

    const totalCustomers = users.length;

    // Current month
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const newThisMonth = users.filter(
      (user) => new Date(user.createdAt) >= startOfMonth
    ).length;

    // Returning customers = customers with more than 1 valid order
    const returningCustomers = customers.filter(
      (customer) => customer.orders > 1
    ).length;

    return res.status(200).json({
      success: true,

      stats: {
        totalCustomers,
        newThisMonth,
        returningCustomers,
      },

      count: customers.length,

      customers,
    });
  } catch (error) {
    console.error("Get All Customers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};