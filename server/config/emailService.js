import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify email configuration when server starts
export const verifyEmailConfiguration = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email service connected successfully");
  } catch (error) {
    console.error("❌ Email service connection failed:", error.message);
  }
};

// Send abandoned cart email
export const sendAbandonedCartEmail = async ({
  email,
  name,
  cartItems,
  totalAmount,
}) => {
  try {
    const customerName = name || "there";

    const productRows = cartItems
      .map(
        (item) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">
              ${item.product?.name || "Product"}
            </td>

            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
              ${item.quantity}
            </td>

            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
              ₹${Number(item.price || 0).toFixed(2)}
            </td>
          </tr>
        `
      )
      .join("");

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const mailOptions = {
      from: `"HoneyTerra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You left something behind 🛒 | HoneyTerra",

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>HoneyTerra</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f5f0e6;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
          ">

            <!-- Header -->
            <div style="
              background-color: #13765b;
              padding: 28px 20px;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              ">
                HoneyTerra
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #e8f5ef;
                font-size: 14px;
              ">
                Natural. Simple. Better.
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 30px 25px;">

              <h2 style="
                color: #222222;
                margin-top: 0;
              ">
                Hey ${customerName}! 👋
              </h2>

              <p style="
                color: #555555;
                line-height: 1.6;
              ">
                You left some items in your HoneyTerra cart.
                They're still waiting for you!
              </p>

              <!-- Products -->
              <table style="
                width: 100%;
                border-collapse: collapse;
                margin: 25px 0;
                color: #333333;
              ">

                <thead>
                  <tr style="
                    background-color: #f5f0e6;
                  ">
                    <th style="
                      padding: 12px;
                      text-align: left;
                    ">
                      Product
                    </th>

                    <th style="
                      padding: 12px;
                      text-align: center;
                    ">
                      Qty
                    </th>

                    <th style="
                      padding: 12px;
                      text-align: right;
                    ">
                      Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  ${productRows}
                </tbody>

              </table>

              <!-- Total -->
              <div style="
                text-align: right;
                margin: 20px 0;
              ">
                <strong style="
                  font-size: 18px;
                  color: #13765b;
                ">
                  Cart Total: ₹${Number(totalAmount || 0).toFixed(2)}
                </strong>
              </div>

              <!-- Button -->
              <div style="
                text-align: center;
                margin: 30px 0;
              ">

                <a
                  href="${frontendUrl}/cart"
                  style="
                    display: inline-block;
                    background-color: #13765b;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 14px 28px;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 16px;
                  "
                >
                  Return to My Cart
                </a>

              </div>

              <p style="
                color: #777777;
                font-size: 13px;
                line-height: 1.5;
              ">
                If you've already completed your purchase,
                you can ignore this email.
              </p>

            </div>

            <!-- Footer -->
            <div style="
              background-color: #f5f0e6;
              padding: 20px;
              text-align: center;
            ">

              <p style="
                margin: 0;
                color: #777777;
                font-size: 12px;
              ">
                © ${new Date().getFullYear()} HoneyTerra. All rights reserved.
              </p>

            </div>

          </div>

        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`📧 Abandoned cart email sent to ${email}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      `❌ Failed to send abandoned cart email to ${email}:`,
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

export default transporter;