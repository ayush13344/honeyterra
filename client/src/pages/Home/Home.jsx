import {
  ArrowRight,
  Check,
  CircleDot,
  Expand,
  PackageCheck,
  Truck,
  Home as HomeIcon,
  Coffee,
  Building2,
  BriefcaseBusiness,
  PartyPopper,
  HelpCircle,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard.jsx";

import ProductReveal from "../../components/ProductReveal/ProductReveal.jsx";

import "./Home.css";


const useCases = [
  {
    icon: HomeIcon,
    title: "Home",
    description: "Compact packs for everyday personal use.",
    category: "home",
  },
  {
    icon: Coffee,
    title: "Café",
    description: "Practical packs for cafés and small spaces.",
    category: "cafe",
  },
  {
    icon: Building2,
    title: "Hotel",
    description: "Bulk-friendly solutions for hospitality.",
    category: "hotel",
  },
  {
    icon: BriefcaseBusiness,
    title: "Office",
    description: "Clean and practical products for workplaces.",
    category: "office",
  },
  {
    icon: PartyPopper,
    title: "Events",
    description: "Useful packs when you need more quantity.",
    category: "event",
  },
  {
    icon: HelpCircle,
    title: "Other",
    description: "Explore the complete HoneyTerra collection.",
    category: "other",
  },
];


function Home() {
  const [products, setProducts] = useState([]);

  const videoRef = useRef(null); 

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [productError, setProductError] =
    useState("");


  /* ==========================================
     FETCH PRODUCTS
  ========================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        setProductError("");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        if (response.data.success) {
          setProducts(
            response.data.products || []
          );
        } else {
          setProducts([]);

          setProductError(
            "Unable to load products."
          );
        }
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        setProducts([]);

        setProductError(
          "Unable to load products right now."
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);



  /* ==========================================
     HONEYTERRA VIDEO PLAY / PAUSE
  ========================================== */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Browser may block autoplay with sound.
            // The video remains available for normal playback.
          });
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  /* ==========================================
     PRODUCT CATEGORIES
  ========================================== */

  const gelProducts = products.filter(
    (product) =>
      product.category === "Gel Ash Trays"
  );

  const honeycombProducts = products.filter(
    (product) =>
      product.category === "Honeycomb Wraps"
  );


  /* ==========================================
     USE CASE ROUTING
  ========================================== */

  const getUseCaseLink = (category) => {
    switch (category) {
      case "home":
        return "/products?use=home";

      case "cafe":
        return "/products?use=cafe";

      case "hotel":
        return "/products?use=hotel";

      case "office":
        return "/products?use=office";

      case "event":
        return "/products?use=event";

      default:
        return "/products";
    }
  };


  return (
    <main className="home-page">

      {/* ======================================
          HERO
      ====================================== */}

      <section className="hero">

        {/* Background overlay */}
        <div className="hero-overlay" />


        {/* ==================================
            HERO CONTENT
        ================================== */}

        <div className="hero-content">

          <p className="hero-eyebrow">
            HONEYTERRA
          </p>


          <h1>
            Better products.
            <br />
            Better everyday.
          </h1>


          <p className="hero-text">
            Thoughtfully designed products for
            everyday spaces, businesses and
            everything in between.
          </p>


          <div className="hero-actions">

            <Link
              to="/shop"
              className="hero-btn hero-btn-primary"
            >
              Shop HoneyTerra

              <ArrowRight size={18} />
            </Link>


            <a
              href="#discover"
              className="hero-btn hero-btn-secondary"
            >
              Discover more
            </a>

          </div>

        </div>


        {/* ==================================
            INTERACTIVE PRODUCT REVEAL
        ================================== */}

        <ProductReveal />


        {/* ==================================
            SCROLL INDICATOR
        ================================== */}

        <div className="hero-scroll">

          <span />

          Scroll to explore

        </div>

      </section>


      {/* ======================================
          INTRODUCTION / WHAT IS HONEYTERRA
          IMAGE IS ONLY HERE - BELOW HERO
      ====================================== */}

      {/* ======================================
          HONEYTERRA VIDEO
      ====================================== */}

      <section
        className="intro-section honeyterra-intro-section"
        id="discover"
      >
        <video
  ref={videoRef}
  className="honeyterra-intro-video"
  src="/videos/video.mp4"
  preload="auto"
  autoPlay
  loop
  playsInline
  muted={false}
  controls={false}
  aria-label="HoneyTerra video"
/>
      </section>


      {/* ======================================
          GEL ASH TRAY
      ====================================== */}

      <section className="product-story ash-tray-story">

        <div className="story-image">

          <img
            src="./images/gelashtray.jpeg"
            alt="HoneyTerra Gel Ash Tray"
          />

        </div>


        <div className="story-content">

          <p className="eyebrow">
            GEL ASH TRAY
          </p>


          <h2>
            Clean design.
            <br />
            Smarter everyday use.
          </h2>


          <p>
            A practical ash tray designed to
            keep your space cleaner while
            fitting naturally into your home,
            café or hospitality environment.
          </p>


          <div className="story-features">

            <div>
              <Check size={17} />
              Easy to use
            </div>


            <div>
              <Check size={17} />
              Compact design
            </div>


            <div>
              <Check size={17} />
              Built for everyday use
            </div>

          </div>


          <Link
            to="/shop/ash-tray"
            className="btn btn-primary"
          >
            Explore Ash Trays

            <ArrowRight size={17} />
          </Link>

        </div>

      </section>


      {/* ======================================
          WHERE WILL YOU USE IT?
      ====================================== */}

      <section className="use-section">

        <div className="section-heading center">

          <p className="eyebrow">
            FIND YOUR FIT
          </p>


          <h2>
            Where will you use it?
          </h2>


          <p>
            Choose your space and we'll take
            you to the products that make the
            most sense for you.
          </p>

        </div>


        <div className="use-grid">

          {useCases.map(
            ({
              icon: Icon,
              title,
              description,
              category,
            }) => (

              <Link
                key={category}
                to="/shop"
                className="use-card"
              >

                <span className="use-icon">

                  <Icon size={25} />

                </span>


                <div>

                  <h3>
                    {title}
                  </h3>


                  <p>
                    {description}
                  </p>

                </div>


                <ArrowRight
                  className="use-arrow"
                  size={19}
                />

              </Link>

            )
          )}

        </div>

      </section>


      {/* ======================================
          HONEYCOMB WRAP
      ====================================== */}

      <section className="product-story honeycomb-story">

        <div className="story-content">

          <p className="eyebrow gold">
            HONEYCOMB WRAP
          </p>


          <h2>
            Protection that
            <br />
            moves with you.
          </h2>


          <p>
            Honeycomb Wrap starts compact and
            expands into a protective cushioning
            layer for products that need a little
            extra care.
          </p>


          <div className="story-features">

            <div>
              <Check size={17} />
              Compact to store
            </div>


            <div>
              <Check size={17} />
              Expands when needed
            </div>


            <div>
              <Check size={17} />
              Flexible protection
            </div>

          </div>


          <Link
            to="/shop/wrap"
            className="btn btn-dark"
          >
            Explore Honeycomb Wrap

            <ArrowRight size={17} />
          </Link>

        </div>


        <div className="story-image">

          <img
            src="./images/honeycomb.png"
            alt="Honeycomb Wrap"
          />

        </div>

      </section>


      {/* ======================================
          HOW TO USE
      ====================================== */}

      <section className="how-section">

        <div className="section-heading center">

          <p className="eyebrow gold">
            HOW TO USE IT
          </p>


          <h2>
            Simple from start to finish.
          </h2>

        </div>


        <div className="steps">

          {[
            [
              CircleDot,
              "01",
              "Pull",
              "Take the wrap from its compact roll.",
            ],

            [
              Expand,
              "02",
              "Expand",
              "Pull the material to open the honeycomb structure.",
            ],

            [
              PackageCheck,
              "03",
              "Wrap",
              "Wrap it around the product you want to protect.",
            ],

            [
              Truck,
              "04",
              "Protect",
              "Place it inside your package and you're ready.",
            ],
          ].map(
            ([Icon, number, title, text]) => (

              <article
                className="step"
                key={number}
              >

                <div className="step-number">
                  {number}
                </div>


                <div className="step-icon">

                  <Icon size={25} />

                </div>


                <h3>
                  {title}
                </h3>


                <p>
                  {text}
                </p>

              </article>

            )
          )}

        </div>

      </section>


      {/* ======================================
          WHERE CAN YOU USE HONEYCOMB WRAP?
      ====================================== */}

      <section className="wrap-use-section">

        <div className="section-heading center">

          <p className="eyebrow">
            WHERE TO USE IT
          </p>


          <h2>
            One wrap. Many possibilities.
          </h2>

        </div>


        <div className="wrap-use-grid">

          <div className="wrap-use-card">

            <span>01</span>

            <h3>
              Glass
            </h3>

            <p>
              Protect bottles and glassware
              during storage or shipping.
            </p>

          </div>


          <div className="wrap-use-card">

            <span>02</span>

            <h3>
              Ceramics
            </h3>

            <p>
              Add cushioning around delicate
              ceramic products.
            </p>

          </div>


          <div className="wrap-use-card">

            <span>03</span>

            <h3>
              Electronics
            </h3>

            <p>
              Create a protective layer around
              sensitive products.
            </p>

          </div>


          <div className="wrap-use-card">

            <span>04</span>

            <h3>
              Gifts
            </h3>

            <p>
              Wrap special products before
              placing them inside a box.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          PRODUCT DISCOVERY
      ====================================== */}

      <section className="product-discovery">

        <div className="product-discovery-header">

          <div>

            <p className="eyebrow">
              THE HONEYTERRA COLLECTION
            </p>


            <h2>
              Simple products.
              <br />
              Thoughtfully made.
            </h2>

          </div>


          <div className="product-discovery-copy">

            <p>
              Designed for homes, cafés, offices
              and everyday spaces. Choose the
              product that fits the way you live
              and work.
            </p>


            <Link
              to="/products"
              className="text-link"
            >
              Explore entire collection

              <ArrowRight size={17} />
            </Link>

          </div>

        </div>


        {/* FEATURED ASH TRAYS */}

        {gelProducts.length > 0 && (

          <div className="featured-product-block">

            <div className="featured-product-info">

              <div>

                <p className="eyebrow">
                  GEL ASH TRAYS
                </p>


                <h3>
                  Everyday,
                  <br />
                  without the mess.
                </h3>


                <p className="featured-product-description">
                  Clean, practical ash trays designed
                  for everyday use at home, in cafés,
                  offices and outdoor spaces.
                </p>

              </div>


              <Link
                to="/products?category=Gel%20Ash%20Trays"
                className="btn btn-secondary"
              >
                Explore ash trays

                <ArrowRight size={17} />
              </Link>

            </div>


            <div className="featured-product-grid">

              {gelProducts
                .slice(0, 3)
                .map((product) => (

                  <ProductCard
                    key={product._id}
                    product={product}
                  />

                ))}

            </div>

          </div>

        )}


        {/* HONEYCOMB WRAPS */}

        {honeycombProducts.length > 0 && (

          <div className="featured-product-block honeycomb-block">

            <div className="featured-product-info">

              <div>

                <p className="eyebrow gold">
                  HONEYCOMB WRAPS
                </p>


                <h3>
                  Protect better.
                  <br />
                  Pack smarter.
                </h3>


                <p className="featured-product-description">
                  Flexible honeycomb protection designed
                  to keep your products safe while
                  reducing unnecessary waste.
                </p>

              </div>


              <Link
                to="/products?category=Honeycomb%20Wraps"
                className="btn btn-secondary"
              >
                Explore honeycomb wraps

                <ArrowRight size={17} />
              </Link>

            </div>


            <div className="featured-product-grid">

              {honeycombProducts
                .slice(0, 3)
                .map((product) => (

                  <ProductCard
                    key={product._id}
                    product={product}
                  />

                ))}

            </div>

          </div>

        )}

      </section>


      {/* ======================================
          FINAL CTA
      ====================================== */}

      <section className="final-cta">

        <div className="final-cta-content">

          <p className="eyebrow">
            READY WHEN YOU ARE
          </p>


          <h2>
            Find the right
            <br />
            HoneyTerra product.
          </h2>


          <p>
            From everyday home use to larger
            commercial needs, discover products
            designed to make things simpler.
          </p>

        </div>


        <div className="final-cta-actions">

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Shop the collection

            <ArrowRight size={17} />
          </Link>


          <Link
            to="/contact"
            className="btn btn-outline"
          >
            Talk to us
          </Link>

        </div>

      </section>

    </main>
  );
}


export default Home;