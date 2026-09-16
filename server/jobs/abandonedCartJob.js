import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { sendAbandonedCartEmail } from "../config/emailService.js";

const ABANDONED_CART_DAYS = 3;

// Check carts every hour
const CHECK_INTERVAL = 60 * 60 * 1000;

export const processAbandonedCarts = async () => {
  try {
    console.log("🛒 Checking for abandoned carts...");

    const cutoffDate = new Date(
      Date.now() - ABANDONED_CART_DAYS * 24 * 60 * 60 * 1000
    );

    const abandonedCarts = await Cart.find({
      updatedAt: { $lte: cutoffDate },
      items: { $exists: true, $not: { $size: 0 } },
      abandonedCartReminderSent: false,
    }).populate("user", "name email");

    console.log(
      `🛒 Found ${abandonedCarts.length} possible abandoned cart(s)`
    );

    for (const cart of abandonedCarts) {
      try {
        const user = cart.user;

        // Make sure the user still exists
        if (!user) {
          console.log(
            `⚠️ Skipping cart ${cart._id}: user not found`
          );

          cart.abandonedCartReminderSent = true;
          await cart.save();

          continue;
        }

        // Make sure the user has an email
        if (!user.email) {
          console.log(
            `⚠️ Skipping cart ${cart._id}: user has no email`
          );

          cart.abandonedCartReminderSent = true;
          await cart.save();

          continue;
        }

        /*
         * Check if the customer placed an order
         * after the cart became inactive.
         */
        const recentOrder = await Order.findOne({
          user: user._id,
          createdAt: { $gt: cart.updatedAt },
        }).sort({ createdAt: -1 });

        if (recentOrder) {
          console.log(
            `✅ User ${user.email} already placed an order. Skipping email.`
          );

          cart.abandonedCartReminderSent = true;
          await cart.save();

          continue;
        }

        // Send reminder email
        const emailResult = await sendAbandonedCartEmail({
          email: user.email,
          name: user.name,
          cartItems: cart.items,
          totalAmount: cart.totalAmount,
        });

        if (emailResult.success) {
          cart.abandonedCartReminderSent = true;
          await cart.save();

          console.log(
            `✅ Abandoned cart processed for ${user.email}`
          );
        } else {
          console.log(
            `⚠️ Email failed for ${user.email}. Will retry later.`
          );
        }
      } catch (cartError) {
        console.error(
          `❌ Error processing cart ${cart._id}:`,
          cartError.message
        );
      }
    }
  } catch (error) {
    console.error(
      "❌ Abandoned cart job failed:",
      error.message
    );
  }
};

export const startAbandonedCartJob = () => {
  console.log("⏰ Abandoned cart job started");
  console.log(
    `⏰ Cart reminder threshold: ${ABANDONED_CART_DAYS} days`
  );
  console.log("⏰ Checking every 1 hour");

  // Run once when server starts
  processAbandonedCarts();

  // Then run every hour
  setInterval(() => {
    processAbandonedCarts();
  }, CHECK_INTERVAL);
};