import { ArrowRight, Leaf, Heart, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="section-eyebrow">ABOUT HONEYTERRA</span>

          <h1>
            Thoughtfully made.
            <br />
            Better for everyday life.
          </h1>

          <p>
            We create simple, useful products that make everyday life
            cleaner, smarter and a little more sustainable.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="about-story section-container">
        <div className="about-story-grid">

          <div className="about-image-placeholder">
            <span>HoneyTerra</span>
            <small>Brand image coming soon</small>
          </div>

          <div className="about-story-content">
            <span className="section-eyebrow">OUR STORY</span>

            <h2>
              Small ideas can make
              <br />
              everyday life better.
            </h2>

            <p>
              HoneyTerra was created with a simple idea — everyday products
              should be practical, thoughtfully designed and better for the
              world around us.
            </p>

            <p>
              From sustainable packaging solutions to everyday-use products,
              we focus on creating things that solve real problems without
              making life complicated.
            </p>

            <p>
              We believe that making a better choice shouldn't mean giving up
              convenience, style or quality.
            </p>
          </div>

        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="section-container">

          <div className="section-heading">
            <span className="section-eyebrow">WHAT WE BELIEVE</span>

            <h2>
              Better products,
              <br />
              made with purpose.
            </h2>
          </div>

          <div className="values-grid">

            <article className="value-card">
              <div className="value-icon">
                <Leaf size={24} />
              </div>

              <h3>Sustainable</h3>

              <p>
                We look for smarter alternatives that reduce unnecessary
                waste and help move everyday choices in a better direction.
              </p>
            </article>

            <article className="value-card">
              <div className="value-icon">
                <Lightbulb size={24} />
              </div>

              <h3>Simple</h3>

              <p>
                Products should be easy to understand, easy to use and
                designed around real everyday needs.
              </p>
            </article>

            <article className="value-card">
              <div className="value-icon">
                <Heart size={24} />
              </div>

              <h3>Made with care</h3>

              <p>
                From the idea to the final product, we focus on thoughtful
                design, usability and a better customer experience.
              </p>
            </article>

          </div>

        </div>
      </section>

      {/* Products */}
      <section className="about-products section-container">

        <div className="section-heading">
          <span className="section-eyebrow">WHAT WE MAKE</span>

          <h2>
            Products designed
            <br />
            for real life.
          </h2>
        </div>

        <div className="about-product-grid">

          <article className="about-product-card">
            <div className="about-product-image">
              <span>Product Image</span>
            </div>

            <div className="about-product-content">
              <span className="product-label">
                SUSTAINABLE PACKAGING
              </span>

              <h3>Honeycomb Wrap</h3>

              <p>
                A plastic-free cushioning solution designed to protect
                fragile products during shipping, retail and gifting.
              </p>

              <Link to="/honey-comb-wrap">
                Explore Honeycomb Wrap
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>

          <article className="about-product-card">
            <div className="about-product-image">
              <span>Product Image</span>
            </div>

            <div className="about-product-content">
              <span className="product-label">
                EVERYDAY USE
              </span>

              <h3>Gel Ash Tray</h3>

              <p>
                A practical ash tray designed to help control ash and odour
                while keeping your space cleaner.
              </p>

              <Link to="/gel-ash-tray">
                Explore Gel Ash Tray
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>

        </div>

      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-content">

          <span className="section-eyebrow">
            MAKE A BETTER CHOICE
          </span>

          <h2>
            Discover something
            <br />
            made for everyday life.
          </h2>

          <p>
            Explore the HoneyTerra collection and find the product that
            works for you.
          </p>

          <Link to="/shop" className="primary-button">
            Explore Products
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </main>
  );
}

export default About;