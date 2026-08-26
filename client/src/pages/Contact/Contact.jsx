import {
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  AtSign,
  Globe,
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
              CONTACT OPTIONS
          ================================================= */}

          <div className="contact-info">

            <div className="contact-info-heading">

              <span className="section-eyebrow">
                GET IN TOUCH
              </span>

              <h2>
                Connect with us.
              </h2>

              <p>
                Reach out to HoneyTerra through any of the
                channels below — we usually reply within one
                business day.
              </p>

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <a
              href="mailto:honeyterra.in@gmail.com"
              className="contact-info-card"
            >

              <div className="contact-info-icon">
                <Mail size={23} />
              </div>

              <div className="contact-info-content">

                <span className="contact-info-label">
                  EMAIL
                </span>

                <strong>
                  honeyterra.in@gmail.com
                </strong>

              </div>

            </a>


            {/* =================================================
                PHONE
            ================================================= */}

            <a
              href="tel:+917489075572"
              className="contact-info-card"
            >

              <div className="contact-info-icon">
                <Phone size={23} />
              </div>

              <div className="contact-info-content">

                <span className="contact-info-label">
                  PHONE
                </span>

                <strong>
                  +91 74890 75572
                </strong>

              </div>

            </a>


            {/* =================================================
                WHATSAPP
            ================================================= */}

            <a
              href="https://wa.me/917489075572"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-card"
            >

              <div className="contact-info-icon">
                <MessageCircle size={23} />
              </div>

              <div className="contact-info-content">

                <span className="contact-info-label">
                  WHATSAPP
                </span>

                <strong>
                  +91 74890 75572
                </strong>

              </div>

            </a>


            {/* =================================================
                INSTAGRAM
            ================================================= */}

            <a
              href="https://www.instagram.com/honeyterra.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-card"
            >

              <div className="contact-info-icon">
                <AtSign size={23} />
              </div>

              <div className="contact-info-content">

                <span className="contact-info-label">
                  INSTAGRAM
                </span>

                <strong>
                  @honeyterra.in
                </strong>

              </div>

            </a>


            {/* =================================================
                WEBSITE
            ================================================= */}

            <a
              href="https://honeyterra.in"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-card"
            >

              <div className="contact-info-icon">
                <Globe size={23} />
              </div>

              <div className="contact-info-content">

                <span className="contact-info-label">
                  WEBSITE
                </span>

                <strong>
                  honeyterra.in
                </strong>

              </div>

            </a>

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