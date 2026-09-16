import { ArrowRight, Home, Leaf, Heart, Globe2, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-page">

      {/* ================================
          MAIN 404 SECTION
      ================================= */}

      <main className="not-found-main">

        {/* Decorative leaves */}
        <div className="decor-leaves decor-left">
          <Leaf size={90} strokeWidth={1.2} />
        </div>

        <div className="decor-leaves decor-right">
          <Leaf size={75} strokeWidth={1.2} />
        </div>


        {/* ================================
            404 CONTENT
        ================================= */}

        <section className="not-found-content">

          <div className="error-number">

            <span>4</span>

            <div className="honeycomb-zero">
              <Hexagon
                size={190}
                strokeWidth={1.4}
              />

              <Leaf
                className="zero-leaf"
                size={48}
                strokeWidth={1.5}
              />
            </div>

            <span>4</span>

          </div>


          <h1>
            Oops, this page got wrapped away.
          </h1>

          <p>
            The page you're looking for doesn't exist
            or may have moved.
          </p>


          {/* ================================
              ACTIONS
          ================================= */}

          <div className="not-found-actions">

            <Link
              to="/"
              className="back-home-btn"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>


            <Link
              to="/shop"
              className="continue-shopping"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </Link>

          </div>

        </section>


        {/* ================================
            BEE DECORATION
        ================================= */}

        <div className="bee-path">

          <span className="bee">
            🐝
          </span>

          <svg
            viewBox="0 0 300 100"
            className="bee-line"
          >
            <path
              d="M10 70
                 C70 20, 80 90, 130 50
                 C180 10, 210 70, 290 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="5 6"
            />
          </svg>

        </div>


        {/* ================================
            PACKAGING DECORATION
        ================================= */}

        <div className="package-decoration">

          <div className="package-box">
            <span>Small</span>
            <span>Choices</span>
            <span>Big Impact</span>
          </div>

          <div className="wrap-decoration">
            <div className="wrap-roll" />
            <div className="wrap-sheet" />
          </div>

        </div>


        <div className="package-decoration package-right">

          <div className="wrap-decoration">
            <div className="wrap-roll" />
            <div className="wrap-sheet" />
          </div>

        </div>


        {/* ================================
            SIDE MESSAGE
        ================================= */}

        <div className="side-message">
          <span>Good</span>
          <span>Packaging</span>
          <span>Brighter</span>
          <span>Tomorrow</span>

          <div className="side-line" />
        </div>

      </main>


      {/* ================================
          BOTTOM VALUES
      ================================= */}

      <section className="not-found-values">

        <div className="value-item">
          <Leaf size={38} strokeWidth={1.4} />

          <div>
            <span>Sustainable</span>
            <span>Materials</span>
          </div>
        </div>


        <div className="value-divider" />


        <div className="value-item">
          <Hexagon size={38} strokeWidth={1.4} />

          <div>
            <span>Thoughtful</span>
            <span>Packaging</span>
          </div>
        </div>


        <div className="value-divider" />


        <div className="value-item">
          <Globe2 size={38} strokeWidth={1.4} />

          <div>
            <span>Happier</span>
            <span>Planet</span>
          </div>
        </div>


        <div className="value-divider" />


        <div className="value-item">
          <Heart size={38} strokeWidth={1.4} />

          <div>
            <span>A Greener</span>
            <span>Tomorrow</span>
          </div>
        </div>

      </section>

    </div>
  );
}