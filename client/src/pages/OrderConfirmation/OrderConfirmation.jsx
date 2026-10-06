
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId =
    location.state?.orderId ||
    localStorage.getItem("lastOrderId");

  return (
    <main className="order-confirmation-page">
      <div className="order-confirmation-card">

        <div className="order-confirmation-icon">
          <CheckCircle2 size={48} />
        </div>

        <span className="order-confirmation-eyebrow">
          HONEYTERRA
        </span>

        <h1>
          Order confirmed!
        </h1>

        <p className="order-confirmation-message">
          Thank you for your order. Your payment
          was successful and your order has been
          placed successfully.
        </p>

        {orderId && (
          <div className="order-confirmation-number">
            <span>
              Order ID
            </span>

            <strong>
              {orderId}
            </strong>
          </div>
        )}

        <div className="order-confirmation-actions">

          <button
            type="button"
            className="order-confirmation-primary"
            onClick={() => navigate("/my-orders")}
          >
            <Package size={19} />

            View my orders

            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="order-confirmation-secondary"
            onClick={() => navigate("/shop")}
          >
            <ShoppingBag size={18} />

            Continue shopping
          </button>

        </div>

      </div>
    </main>
  );
};

export default OrderConfirmation;
