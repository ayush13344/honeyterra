const products = [
  {
    id: "crystal-round",
    name: "Crystal Round",
    category: "Gel Ash Tray",
    price: 249,
    badge: "Bestseller",
    image: "/images/crystal-round.jpg",
    description: "Elegant round design with premium gel.",
  },
  {
    id: "square-minimal",
    name: "Square Minimal",
    category: "Gel Ash Tray",
    price: 249,
    image: "/images/square-minimal.jpg",
    description: "Minimal design for a modern look.",
  },
  {
    id: "classic-round",
    name: "Classic Round",
    category: "Gel Ash Tray",
    price: 229,
    image: "/images/classic-round.jpg",
    description: "The everyday classic that goes with everything.",
  },
  {
    id: "bulk-value-pack",
    name: "Bulk Value Pack",
    category: "Gel Ash Tray",
    price: 799,
    badge: "Best Value",
    image: "/images/bulk-value-pack.jpg",
    description: "Stock up for home, office or events.",
  },
  {
    id: "honeycomb-wrap",
    name: "Honeycomb Wrap",
    category: "Honeycomb Wrap",
    price: 599,
    image: "/images/honeycomb-wrap.jpg",
    description:
      "Lightweight honeycomb cushioning for safer, plastic-free packaging.",
  },
];

/*
|--------------------------------------------------------------------------
| Detailed Product Data
|--------------------------------------------------------------------------
*/

const productDetails = {
  gelAshTray: {
    id: "gel-ash-tray",

    name: "HoneyTerra Gel Ash Tray",

    category: "Gel Ash Tray",

    tagline: "Clean. Stylish. Smoke-Friendly.",

    description:
      "A thoughtfully designed gel ash tray made for everyday use at home, cafés, hotels, lounges and events.",

    images: [
      "/images/crystal-round.jpg",
      "/images/square-minimal.jpg",
      "/images/classic-round.jpg",
    ],

    benefits: [
      "Cigarette-extinguishing gel core",
      "Helps control ash and odour",
      "Easy to clean",
      "Designed for everyday use",
    ],

    variants: [
      {
        id: "crystal-round",
        name: "Crystal Round",
        price: 249,
        badge: "Bestseller",
      },
      {
        id: "square-minimal",
        name: "Square Minimal",
        price: 249,
      },
      {
        id: "classic-round",
        name: "Classic Round",
        price: 229,
      },
      {
        id: "bulk-value-pack",
        name: "Bulk Value Pack",
        price: 799,
        badge: "Best Value",
      },
    ],
  },

  honeycombWrap: {
    id: "honeycomb-wrap",

    name: "Honeycomb Wrap",

    category: "Sustainable Packaging",

    tagline: "Protect more. Plastic less.",

    description:
      "Honeycomb Wrap expands from a compact roll into protective cushioning, helping replace unnecessary plastic packaging.",

    images: [
      "/images/honeycomb-wrap.jpg",
    ],

    benefits: [
      "Plastic-free cushioning",
      "Lightweight and practical",
      "Compact and easy to store",
      "Suitable for fragile products",
    ],

    useCases: [
      "Glass Bottles",
      "Ceramics",
      "Electronics",
      "Cosmetics",
      "Gifts",
      "E-commerce & Retail",
    ],
  },
};

export { products, productDetails };

export default products;