import {
  ArrowRight,
  Mail,
  MessageCircle,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Contact.css";

function Contact() {

  const handleSubmit = (event) => {
    event.preventDefault();

    // Backend contact API will be connected later.
    console.log("Contact form submitted");
  };

  return (
    <main className="contact-page">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact-hero">

        <div className="contact-hero-glow" />

        <div className="contact-hero-content">

          <span className="section-eyebrow">
            CONTACT HONEYTERRA
          </span>

          <h1>
            We're here
            <br />
            <span>to help.</span>
          </h1>

          <p>
            Have a question about a product, an order, or anything
            HoneyTerra? We'd love to hear from you.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTACT MAIN
      ===================================================== */}

      <section className="contact-main section-container">

        <div className="contact-grid">


          {/* =================================================
              FORM
          ================================================= */}

          <div className="contact-form-card">

            <div className="contact-form-header">

              <span className="section-eyebrow">
                SEND US A MESSAGE
              </span>

              <h2>
                How can we help?
              </h2>

              <p>
                Fill out the form and our team will get back to
                you as soon as possible.
              </p>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="contact-form-row">

                <div className="contact-field">

                  <label htmlFor="contact-name">
                    Name
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    required
                  />

                </div>


                <div className="contact-field">

                  <label htmlFor="contact-email">
                    Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />

                </div>

              </div>


              <div className="contact-field">

                <label htmlFor="contact-subject">
                  Subject
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  placeholder="What can we help you with?"
                  required
                />

              </div>


              <div className="contact-field">

                <label htmlFor="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  rows="6"
                  placeholder="Tell us a little more..."
                  required
                />

              </div>


              <button
                type="submit"
                className="contact-submit"
              >
                Send Message
                <ArrowRight size={17} />
              </button>

            </form>

          </div>


          {/* =================================================
              INFORMATION
          ================================================= */}

          <div className="contact-info">


            <div className="contact-info-intro">

              <span className="section-eyebrow">
                GET IN TOUCH
              </span>

              <h2>
                Let's talk.
              </h2>

              <p>
                Whether you have a question about our products,
                an order or simply want to say hello, we're here.
              </p>

            </div>


            {/* Email */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                <Mail size={20} />
              </div>

              <div>

                <h3>Email us</h3>

                <p>
                  Have a question? Send us a message and our
                  team will get back to you.
                </p>

                <a href="mailto:hello@honeyterra.com">
                  hello@honeyterra.com
                </a>

              </div>

            </div>


            {/* Order */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                <Package size={20} />
              </div>

              <div>

                <h3>Need help with an order?</h3>

                <p>
                  Questions about shipping, delivery or your
                  order? We're happy to help.
                </p>

                <Link to="/track-order">
                  Track your order
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>


            {/* FAQ */}

            <div className="contact-info-card">

              <div className="contact-info-icon">
                <MessageCircle size={20} />
              </div>

              <div>

                <h3>Frequently asked questions</h3>

                <p>
                  Find quick answers to common questions about
                  HoneyTerra products and orders.
                </p>

                <Link to="/faqs">
                  Visit FAQs
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="contact-bottom">

        <div className="contact-bottom-glow" />

        <div className="contact-bottom-content">

          <span className="section-eyebrow">
            HONEYTERRA
          </span>

          <h2>
            Better products.
            <br />
            <span>Better everyday choices.</span>
          </h2>

          <p>
            Explore our collection and discover thoughtfully
            designed products for everyday life.
          </p>

          <Link
            to="/shop"
            className="primary-button"
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Contact;