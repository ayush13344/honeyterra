import { useState } from "react";

import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

import { Link } from "react-router-dom";

import ProductGallery from "../../../components/ProductGallery/ProductGallery";
import SmokeEffect from "../../../components/SmokeEffect/SmokeEffect";

import { productDetails } from "../../../data/products";
import { useCart } from "../../../context/CartContext";
import "./GelAshTray.css";

function GelAshTray() {
  const product = productDetails.gelAshTray;
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]
  );

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const handleAddToCart = () => {
  addToCart({
    id: `gel-ash-tray-${selectedVariant.id}`,
    productId: "gel-ash-tray",
    name: "HoneyTerra Gel Ash Tray",
    variant: selectedVariant.name,
    price: selectedVariant.price,
    image: product.images?.[0],
    category: "Gel Ash Tray",
    quantity,
  });

  setQuantity(1);
};

  return (
    <main className="gel-page">

      {/* Product Hero */}

      <section className="gel-product-section">

        <SmokeEffect density={22} />
        <div className="gel-hero-glow" />

        <div className="gel-container">

          <div className="gel-product-grid">

            {/* Gallery */}

            <div className="gel-gallery-wrap">
              <ProductGallery
                images={product.images}
              />

              <div className="gel-float-badge">
                <span className="gel-float-dot" />
                <div>
                  <strong>1,200+</strong>
                  <small>trays sold</small>
                </div>
              </div>
            </div>


            {/* Product Information */}

            <div className="gel-product-info">

              <div className="gel-top-row">
                <span className="gel-category">
                  GEL ASH TRAY
                </span>

                <span className="gel-rating">
                  <Star size={13} fill="#d4a054" />
                  <Star size={13} fill="#d4a054" />
                  <Star size={13} fill="#d4a054" />
                  <Star size={13} fill="#d4a054" />
                  <Star size={13} fill="#d4a054" />
                  <em>4.8 rating</em>
                </span>
              </div>

              <h1>
                Clean. Stylish.
                <br />
                <span className="gel-h1-accent">Smoke-Friendly.</span>
              </h1>

              <p className="gel-description">
                {product.description}
              </p>


              {/* Benefits */}

              <div className="gel-benefits">

                {product.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="gel-benefit"
                  >
                    <Check size={17} />
                    <span>{benefit}</span>
                  </div>
                ))}

              </div>


              {/* Pack */}

              <div className="gel-option-section">

                <div className="gel-option-heading">
                  <h3>Choose your pack</h3>

                  <span>
                    {selectedVariant.name}
                  </span>
                </div>


                <div className="gel-variants">

                  {product.variants.map(
                    (variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        className={`gel-variant ${
                          selectedVariant.id ===
                          variant.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedVariant(
                            variant
                          )
                        }
                      >

                        {variant.badge && (
                          <span className="variant-badge">
                            {variant.badge}
                          </span>
                        )}

                        <span className="variant-name">
                          {variant.name}
                        </span>

                        <span className="variant-price">
                          ₹{variant.price}
                        </span>

                      </button>
                    )
                  )}

                </div>

              </div>


              {/* Quantity */}

              <div className="gel-purchase-row">

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>

                </div>


                <button
  type="button"
  className="gel-add-cart"
  onClick={handleAddToCart}
>
  <ShoppingBag size={18} />

  Add to Cart

  <span>
    ₹
    {(selectedVariant.price * quantity).toLocaleString("en-IN")}
  </span>
</button>

              </div>


              <div className="gel-trust-strip">
                <div className="gel-trust-item">
                  <ShieldCheck size={17} />
                  <span>Secure Checkout</span>
                </div>
                <div className="gel-trust-item">
                  <Truck size={17} />
                  <span>Fast Dispatch</span>
                </div>
                <div className="gel-trust-item">
                  <RotateCcw size={17} />
                  <span>Easy Returns</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Why section */}

      <section className="gel-why">

        <div className="gel-container">

          <div className="gel-section-heading">

            <span className="gel-eyebrow">
              WHY YOU'LL LIKE IT
            </span>

            <h2>
              Small product.
              <br />
              Big difference.
            </h2>

          </div>


          <div className="gel-feature-grid">

            <div className="gel-feature">
              <div className="feature-number">
                01
              </div>

              <h3>Odour Control</h3>

              <p>
                Designed to trap ash and help keep
                your space feeling cleaner and fresher.
              </p>
            </div>


            <div className="gel-feature">
              <div className="feature-number">
                02
              </div>

              <h3>Easy to Clean</h3>

              <p>
                A simple everyday solution without
                unnecessary cleaning hassle.
              </p>
            </div>


            <div className="gel-feature">
              <div className="feature-number">
                03
              </div>

              <h3>Durable</h3>

              <p>
                Designed for everyday use at home,
                cafés, hotels and lounges.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Use Cases */}

      <section className="gel-use">

        <div className="gel-container">

          <div className="gel-section-heading">

            <span className="gel-eyebrow">
              MADE FOR REAL LIFE
            </span>

            <h2>
              Where will you use it?
            </h2>

          </div>


          <div className="gel-use-grid">

            {[
              "Home",
              "Café",
              "Hotel",
              "Lounge",
              "Business",
              "Events",
            ].map((item) => (
              <div
                key={item}
                className="gel-use-item"
              >
                {item}
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="gel-cta">

        <span className="gel-eyebrow">
          HONEYTERRA
        </span>

        <h2>
          A cleaner way
          <br />
          to enjoy your space.
        </h2>

        <button
          type="button"
          className="gel-cta-button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          Choose Your Pack
          <ArrowRight size={18} />
        </button>

      </section>

    </main>
  );
}

export default GelAshTray;