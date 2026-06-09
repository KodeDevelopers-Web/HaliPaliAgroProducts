const products = window.products = [
  {
    id: "mustard-honey",
    name: "Mustard Honey",
    type: "Mustard Honey",
    category: "Mustard Honey",
    shelfLife: "1 Year",
    form: "Viscous Liquid",
    storage: "Cool and Dry Place",
    rating: 5,
    reviews: 24,
    description: "Mustard Honey with a naturally rich taste, sourced and packed for everyday purity.",
    longDescription: "Mustard Honey is a farm fresh viscous liquid honey known for its distinctive natural sweetness and golden character. It is packed for reliable storage, clean usage, and daily wellness routines.",
    benefits: [
      "100% Natural",
      "No Added Sugar",
      "Farm Fresh",
      "Viscous Liquid",
      "1 Year Shelf Life",
      "Cool And Dry Storage",
    ],
    variants: [
      {
        size: "400g",
        price: 240,
        image: "/docs/ASSETS/Mustard400G.webp"
      },
      {
        size: "600g",
        price: 350,
        image: "/docs/ASSETS/Mustard600G.webp",
      },
      {
        size: "1kg",
        price: 580,
        image: "/docs/ASSETS/Mustard1KG.webp",
      },
    ],
  },
  {
    id: "wildflower-honey",
    name: "Wildflower Honey",
    type: "Wildflower Honey",
    category: "Wildflower Honey",
    shelfLife: "1 Year",
    form: "Viscous Liquid",
    storage: "Cool and Dry Place",
    rating: 5,
    reviews: 21,
    description: "Wildflower Honey with a smooth floral profile and natural sweetness for daily use.",
    longDescription: "Wildflower Honey is a naturally sweet viscous liquid honey with a balanced floral taste. It is selected for purity, everyday usefulness, and dependable quality in each available pack size.",
    benefits: [
      "Natural Sweetness",
      "Floral Taste",
      "Farm Fresh",
      "Viscous Liquid",
      "1 Year Shelf Life",
      "No Artificial Additives",
    ],
    variants: [
      {
        size: "600g",
        price: 170,
        image: "/docs/ASSETS/Wildflower600G.webp",
      },
      {
        size: "1kg",
        price: 289,
        image: "/docs/ASSETS/Wildflower1KG.webp",
      },
    ],
  },
  {
    id: "jandi-honey",
    name: "Jandi Honey",
    type: "Jandi Honey",
    category: "Jandi Honey",
    shelfLife: "1 Year",
    form: "Viscous Liquid",
    storage: "Cool and Dry Place",
    rating: 5,
    reviews: 18,
    description: "Jandi Honey with a natural raw honey profile and naturally satisfying taste.",
    longDescription: "Jandi Honey is a raw organic honey option with a smooth viscous form and natural sweetness. It is packed in practical variants for home use, gifting, and daily wellness.",
    benefits: [
      "Raw Organic Honey",
      "No Added Sugar",
      "Farm Fresh",
      "Viscous Liquid",
      "1 Year Shelf Life",
      "Natural Taste",
    ],
    variants: [
      {
        size: "400g",
        price: 220,
        image: "/docs/ASSETS/Jandi400G.webp",
      },
      {
        size: "600g",
        price: 320,
        image: "/docs/ASSETS/Jandi600G.webp",
      },
      {
        size: "1kg",
        price: 500,
        image: "/docs/ASSETS/Jandi1KG.webp",
      },
    ],
  },
  {
    id: "sheesham-honey",
    name: "Sheesham Honey",
    type: "Sheesham Honey",
    category: "Sheesham Honey",
    shelfLife: "1 Year",
    form: "Viscous Liquid",
    storage: "Cool and Dry Place",
    rating: 5,
    reviews: 20,
    description: "Sheesham Honey with a premium natural taste and smooth viscous texture.",
    longDescription: "Sheesham Honey is packed for customers who prefer a premium organic honey option with natural sweetness and a smooth liquid form. Store it in a cool and dry place for best quality.",
    benefits: [
      "Organic Honey",
      "No Added Sugar",
      "Farm Fresh",
      "Viscous Liquid",
      "1 Year Shelf Life",
      "Cool And Dry Storage",
    ],
    variants: [
      {
        size: "400g",
        price: 220,
        image: "/docs/ASSETS/Sheesham400G.webp",
      },
      {
        size: "600g",
        price: 320,
        image: "/docs/ASSETS/Sheesham600G.webp",
      },
      {
        size: "1kg",
        price: 500,
        image: "/docs/ASSETS/Sheesham1KG.webp",
      },
    ],
  },
];

const productCatalog = window.productCatalog = {
  all: products,
  findById(id) {
    return products.find((product) => product.id === id);
  },
  categories() {
    return [...new Set(products.map((product) => product.type))];
  },
  primaryVariant(product) {
    return product.variants[0];
  },
  image(product, variant = product.variants[0]) {
    return variant.image;
  },
  sizes(product) {
    return product.variants.map((variant) => variant.size);
  },
  related(product, limit = 3) {
    return products.filter((item) => item.id !== product.id).slice(0, limit);
  },
  formatPrice(price) {
    return `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;
  },
  stars(rating) {
    return "*".repeat(Math.round(rating || 0));
  },
};
