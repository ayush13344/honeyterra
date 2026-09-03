import {
  ArrowRight,
  Leaf,
  Heart,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        <div className="about-hero-glow about-hero-glow-one" />
        <div className="about-hero-glow about-hero-glow-two" />

        <div className="about-hero-content">

          <span className="section-eyebrow">
            ABOUT HONEYTERRA
          </span>

          <h1>
            Thoughtfully made.
            <br />
            <span>Better for everyday life.</span>
          </h1>

          <p>
            We create simple, useful products that make everyday life
            cleaner, smarter and a little more sustainable.
          </p>

          <div className="about-hero-actions">

            <Link to="/shop" className="about-primary-button">
              Explore Products
              <ArrowRight size={17} />
            </Link>

            <a
              href="#our-story"
              className="about-text-button"
            >
              Discover our story
            </a>

          </div>

        </div>

        <div className="about-hero-bottom">

          <div>
            <span>01</span>
            <p>Thoughtful design</p>
          </div>

          <div>
            <span>02</span>
            <p>Everyday usefulness</p>
          </div>

          <div>
            <span>03</span>
            <p>Better choices</p>
          </div>

        </div>

      </section>


      {/* =====================================================
          STORY
      ===================================================== */}

      <section
        className="about-story section-container"
        id="our-story"
      >

        <div className="about-story-grid">

          <div className="about-story-visual">

            <div className="about-image-placeholder">

              <div className="about-image-inner">
                <span className="about-image-brand">
                  Honey<span>Terra</span>
                </span>

                <span className="about-image-caption">
                  Better ideas for everyday life.
                </span>
              </div>

            </div>

            <div className="story-floating-card">
              <Leaf size={18} />
              <span>Made with purpose</span>
            </div>

          </div>


          <div className="about-story-content">

            <span className="section-eyebrow">
              OUR STORY
            </span>

            <h2>
              Small ideas can make
              <br />
              everyday life <em>better.</em>
            </h2>

            <p>
              HoneyTerra was created with a simple idea — everyday
              products should be practical, thoughtfully designed
              and better for the world around us.
            </p>

            <p>
              From sustainable packaging solutions to everyday-use
              products, we focus on creating things that solve real
              problems without making life complicated.
            </p>

            <p>
              We believe that making a better choice shouldn't mean
              giving up convenience, style or quality.
            </p>

            <Link
              to="/shop"
              className="about-inline-link"
            >
              Explore our products
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="about-values">

        <div className="section-container">

          <div className="section-heading">

            <span className="section-eyebrow">
              WHAT WE BELIEVE
            </span>

            <h2>
              Better products,
              <br />
              <span>made with purpose.</span>
            </h2>

            <p>
              Every HoneyTerra product starts with a simple question:
              can we make this more useful, thoughtful and responsible?
            </p>

          </div>


          <div className="values-grid">

            <article className="value-card">

              <div className="value-card-number">
                01
              </div>

              <div className="value-icon">
                <Leaf size={22} />
              </div>

              <h3>Sustainable</h3>

              <p>
                We look for smarter alternatives that reduce
                unnecessary waste and help move everyday choices
                in a better direction.
              </p>

            </article>


            <article className="value-card">

              <div className="value-card-number">
                02
              </div>

              <div className="value-icon">
                <Lightbulb size={22} />
              </div>

              <h3>Simple</h3>

              <p>
                Products should be easy to understand, easy to use
                and designed around real everyday needs.
              </p>

            </article>


            <article className="value-card">

              <div className="value-card-number">
                03
              </div>

              <div className="value-icon">
                <Heart size={22} />
              </div>

              <h3>Made with care</h3>

              <p>
                From the idea to the final product, we focus on
                thoughtful design, usability and a better customer
                experience.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="about-products section-container">

        <div className="section-heading products-heading">

          <span className="section-eyebrow">
            WHAT WE MAKE
          </span>

          <h2>
            Products designed
            <br />
            <span>for real life.</span>
          </h2>

        </div>


        <div className="about-product-grid">


          {/* Honeycomb */}

          <article className="about-product-card">

            <div className="about-product-image honeycomb-product">

              <div className="product-image-placeholder">
               <img
            src="/images/gelashtray.jpeg"
            alt="HoneyTerra Gel Ash Tray"
          />
              </div>

              <span className="product-number">
                01
              </span>

            </div>


            <div className="about-product-content">

              <span className="product-label">
                SUSTAINABLE PACKAGING
              </span>

              <h3>Honeycomb Wrap</h3>

              <p>
                A plastic-free cushioning solution designed to
                protect fragile products during shipping, retail
                and gifting.
              </p>

              <Link to="/shop/wrap">
                Explore Honeycomb Wrap
                <ArrowRight size={17} />
              </Link>

            </div>

          </article>


          {/* Gel Ash Tray */}

          <article className="about-product-card">

            <div className="about-product-image ashtray-product">

              <div className="product-image-placeholder">
                
                <img
            src="/images/gelashtray.jpeg"
            alt="HoneyTerra Gel Ash Tray"
          />
              </div>

              <span className="product-number">
                02
              </span>

            </div>


            <div className="about-product-content">

              <span className="product-label">
                EVERYDAY USE
              </span>

              <h3>Gel Ash Tray</h3>

              <p>
                A practical ash tray designed to help control ash
                and odour while keeping your space cleaner.
              </p>

              <Link to="/shop/ash-tray">
                Explore Gel Ash Tray
                <ArrowRight size={17} />
              </Link>

            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta">

        <div className="about-cta-glow" />

        <div className="about-cta-content">

          <span className="section-eyebrow">
            HONEYTERRA
          </span>

          <h2>
            Discover something
            <br />
            <span>made for everyday life.</span>
          </h2>

          <p>
            Explore the HoneyTerra collection and find the product
            that works for you.
          </p>

          <Link
            to="/shop"
            className="about-cta-button"
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default About;