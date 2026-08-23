import {
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard";

import {productDetails} from "../../data/products";

import "./Shop.css";

function Shop() {
  const { gelAshTray, honeycombWrap } = productDetails;

  return (
    <main className="shop-page">

      {/* Hero */}

      <section className="shop-hero">

        <span className="section-eyebrow">
          HONEYTERRA SHOP
        </span>

        <h1>
          Better products.
          <br />
          Better everyday choices.
        </h1>

        <p>
          Discover thoughtfully designed products made for
          everyday life.
        </p>

      </section>


      {/* Products */}

      <section className="shop-products">

        <div className="shop-container">

          <div className="shop-heading">

            <div>
              <span className="section-eyebrow">
                OUR COLLECTION
              </span>

              <h2>
                Shop HoneyTerra
              </h2>
            </div>

            <p>
              Simple products. Practical solutions.
              Thoughtfully made.
            </p>

          </div>


          <div className="shop-product-grid">

            <ProductCard
              imageLabel="Gel Ash Tray"
              category="Gel Ash Tray"
              name="HoneyTerra Gel Ash Tray"
              description={gelAshTray.tagline}
              price={gelAshTray.variants[0].price}
              badge="Bestseller"
              link="/gel-ash-tray"
            />


            <ProductCard
              imageLabel="Honeycomb Wrap"
              category="Sustainable Packaging"
              name="Honeycomb Wrap"
              description={honeycombWrap.tagline}
              price={null}
              link="/honey-comb-wrap"
            />

          </div>

        </div>

      </section>


      {/* Benefits */}

      <section className="shop-benefits">

        <div className="shop-container">

          <div className="shop-benefits-heading">

            <span className="section-eyebrow">
              WHY HONEYTERRA
            </span>

            <h2>
              Good products should
              <br />
              make sense.
            </h2>

          </div>


          <div className="shop-benefits-grid">

            <div className="shop-benefit">

              <div className="shop-benefit-icon">
                <Leaf size={23} />
              </div>

              <h3>Eco Friendly</h3>

              <p>
                Thoughtfully designed products with
                sustainability in mind.
              </p>

            </div>


            <div className="shop-benefit">

              <div className="shop-benefit-icon">
                <ShieldCheck size={23} />
              </div>

              <h3>Made for Real Life</h3>

              <p>
                Practical products designed around
                everyday needs.
              </p>

            </div>


            <div className="shop-benefit">

              <div className="shop-benefit-icon">
                <Sparkles size={23} />
              </div>

              <h3>Made with Care</h3>

              <p>
                Thoughtful design without unnecessary
                complexity.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="shop-cta">

        <div>

          <span className="section-eyebrow">
            HONEYTERRA
          </span>

          <h2>
            Choose better.
            <br />
            Keep it simple.
          </h2>

          <Link
            to="/contact"
            className="shop-cta-button"
          >
            Have a question?
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Shop;