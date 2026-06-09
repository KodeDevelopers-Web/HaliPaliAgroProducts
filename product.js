const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = productCatalog.findById(productId);

const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const productView = document.querySelector("#productView");
const notFound = document.querySelector("#notFound");
const benefitsSection = document.querySelector("#productBenefits");
const detailsSection = document.querySelector("#detailsSection");
const reviewsSection = document.querySelector("#reviews");
const relatedSection = document.querySelector("#relatedSection");
const toast = document.querySelector(".toast");
const quantityValue = document.querySelector("#quantityValue");
const addToCart = document.querySelector("#addToCart");
const buyNow = document.querySelector("#buyNow");
const mobileAddToCart = document.querySelector("#mobileAddToCart");
const mobilePurchaseBar = document.querySelector("#mobilePurchaseBar");
const cartCount = document.querySelector(".cart-count");
const newsletterForm = document.querySelector(".newsletter-form");

let quantity = 1;
let toastTimer;
let activeTab = "description";
let selectedVariant = product ? productCatalog.primaryVariant(product) : null;

const setText = (selector, text) => {
  document.querySelector(selector).textContent = text;
};

const getCartTotalQuantity = () => {
  const cart = JSON.parse(localStorage.getItem("haliPaliCart") || "[]");
  return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
};

const updateCartCount = () => {
  if (!cartCount) return;
  cartCount.textContent = String(getCartTotalQuantity());
};

const showToast = (message = "Product Added To Cart") => {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
};

const setLoading = (button, text, callback) => {
  const originalText = button.textContent;
  button.textContent = text;
  button.classList.add("loading");
  button.disabled = true;

  window.setTimeout(() => {
    callback();
    button.textContent = originalText;
    button.classList.remove("loading");
    button.disabled = false;
  }, 650);
};

const renderNotFound = () => {
  document.title = "Product Not Found | Hali Pali Agro Products";
  productView.hidden = true;
  benefitsSection.hidden = true;
  detailsSection.hidden = true;
  reviewsSection.hidden = true;
  relatedSection.hidden = true;
  mobilePurchaseBar.hidden = true;
  notFound.hidden = false;
};

const renderGallery = () => {
  const mainImage = document.querySelector("#mainProductImage");
  const thumbnailRow = document.querySelector("#thumbnailRow");

  mainImage.src = selectedVariant.image;
  mainImage.alt = product.name;
  thumbnailRow.innerHTML = "";

  product.variants.forEach((variant, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = variant.size === selectedVariant.size ? "active" : "";
    button.setAttribute("aria-label", `Show ${product.name} ${variant.size}`);
    button.innerHTML = `<img loading="lazy" src="${variant.image}" alt="${product.name} ${variant.size} thumbnail">`;

    button.addEventListener("click", () => {
      selectVariant(variant.size);
    });

    thumbnailRow.appendChild(button);
  });
};

const renderVariantOptions = () => {
  const variantOptions = document.querySelector("#variantOptions");
  variantOptions.innerHTML = product.variants.map((variant) => `
    <button class="variant-button ${variant.size === selectedVariant.size ? "active" : ""}" type="button" data-size="${variant.size}">
      ${variant.size}
    </button>
  `).join("");

  variantOptions.querySelectorAll(".variant-button").forEach((button) => {
    button.addEventListener("click", () => selectVariant(button.dataset.size));
  });
};

const selectVariant = (size) => {
  const nextVariant = product.variants.find((variant) => variant.size === size);
  if (!nextVariant) return;

  selectedVariant = nextVariant;
  const mainImage = document.querySelector("#mainProductImage");
  mainImage.classList.add("is-fading");

  window.setTimeout(() => {
    mainImage.src = selectedVariant.image;
    mainImage.classList.remove("is-fading");
  }, 150);

  setText("#productPrice", productCatalog.formatPrice(selectedVariant.price));
  setText("#mobilePrice", productCatalog.formatPrice(selectedVariant.price));
  setText("#selectedWeight", selectedVariant.size);

  document.querySelectorAll(".variant-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.size === selectedVariant.size);
  });

  document.querySelectorAll("#thumbnailRow button").forEach((button, index) => {
    button.classList.toggle("active", product.variants[index].size === selectedVariant.size);
  });
};

const renderSummary = () => {
  document.title = `${product.name} | Hali Pali Agro Products`;
  setText("#breadcrumbProduct", product.name);
  setText("#productCategory", product.type);
  setText("#productName", product.name);
  setText("#productRating", productCatalog.stars(product.rating));
  setText("#productReviews", `(${product.reviews} Reviews)`);
  setText("#productPrice", productCatalog.formatPrice(selectedVariant.price));
  setText("#mobilePrice", productCatalog.formatPrice(selectedVariant.price));
  setText("#selectedWeight", selectedVariant.size);
  setText("#productDescription", product.description);
  setText("#reviewTotal", product.reviews);

  const metaDescription = document.querySelector("meta[name='description']");
  const ogTitle = document.querySelector("meta[property='og:title']");
  const ogDescription = document.querySelector("meta[property='og:description']");
  const ogImage = document.querySelector("meta[property='og:image']");

  metaDescription.setAttribute("content", product.description);
  ogTitle.setAttribute("content", `${product.name} | Hali Pali Agro Products`);
  ogDescription.setAttribute("content", product.description);
  ogImage.setAttribute("content", selectedVariant.image);

  document.querySelector("#trustBadges").innerHTML = product.benefits.slice(0, 6).map((benefit) => `
    <div class="trust-badge"><span>&check;</span>${benefit}</div>
  `).join("");
};

const renderTab = () => {
  const tabPanel = document.querySelector("#tabPanel");
  const benefitItems = product.benefits.map((benefit) => `<li>${benefit}</li>`).join("");

  const content = {
    description: `
      <h3>Natural Sourcing And Pure Taste</h3>
      <p>${product.longDescription}</p>
      <ul>
        <li>Type: ${product.type}</li>
        <li>Shelf Life: ${product.shelfLife}</li>
        <li>Form: ${product.form}</li>
        <li>Storage: ${product.storage}</li>
      </ul>
      <p>Our honey is selected with care, packed in secure food-grade packaging, and prepared to preserve natural flavor, smooth texture, and freshness.</p>
    `,
    benefits: `
      <h3>Product Benefits</h3>
      <ul>${benefitItems}</ul>
    `,
    shipping: `
      <div class="shipping-grid">
        <div><h3>Processing Time</h3><p>1-2 Business Days</p></div>
        <div><h3>Delivery Time</h3><p>3-7 Business Days</p></div>
        <div><h3>Storage</h3><p>${product.storage}</p></div>
      </div>
    `,
    faq: `
      <div class="faq-item open"><button type="button">Is this honey pure?<span>+</span></button><p>Yes. It is naturally sourced and packed with care for purity and freshness.</p></div>
      <div class="faq-item"><button type="button">Does it contain added sugar?<span>+</span></button><p>No. The catalog products are positioned as natural honey with no added sugar.</p></div>
      <div class="faq-item"><button type="button">How should I store honey?<span>+</span></button><p>Store it in a cool, dry place away from direct sunlight. Keep the lid tightly closed.</p></div>
      <div class="faq-item"><button type="button">What is the shelf life?<span>+</span></button><p>Honey keeps well when stored properly. Check the product packaging for final batch details.</p></div>
    `,
  };

  tabPanel.innerHTML = content[activeTab];

  tabPanel.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      button.parentElement.classList.toggle("open");
    });
  });
};

const renderRelatedProducts = () => {
  const relatedProducts = document.querySelector("#relatedProducts");
  relatedProducts.innerHTML = productCatalog.related(product, 3).map((item) => `
    <article class="related-card reveal">
      <img loading="lazy" src="${productCatalog.image(item)}" alt="${item.name}">
      <div class="related-card-body">
        <span class="category-badge">${item.type}</span>
        <h3>${item.name}</h3>
        <div class="stars" aria-label="${item.rating} out of 5 stars">${productCatalog.stars(item.rating)}</div>
        <p>Available Sizes: ${productCatalog.sizes(item).join(" • ")}</p>
        <a class="btn btn-secondary" href="product.html?id=${item.id}">View Product</a>
      </div>
    </article>
  `).join("");
};

const renderSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: selectedVariant.image,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Hali Pali Agro Products",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(product.rating),
      reviewCount: String(product.reviews),
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: String(selectedVariant.price),
      availability: "https://schema.org/InStock",
    },
  };

  document.querySelector("#productSchema").textContent = JSON.stringify(schema);
};

const updateQuantity = (nextQuantity) => {
  quantity = Math.max(1, nextQuantity);
  quantityValue.textContent = String(quantity);
};

const saveCartItem = () => {
  const cart = JSON.parse(localStorage.getItem("haliPaliCart") || "[]");
  const existingItem = cart.find((item) => item.productId === product.id && item.variantSize === selectedVariant.size);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      productName: product.name,
      type: product.type,
      variantSize: selectedVariant.size,
      price: selectedVariant.price,
      image: selectedVariant.image,
      quantity,
    });
  }
  localStorage.setItem("haliPaliCart", JSON.stringify(cart));
};

const addProductToCart = (button = addToCart) => {
  setLoading(button, "Adding...", () => {
    saveCartItem();
    updateCartCount();
    showToast(`${product.name} ${selectedVariant.size} Added To Cart`);
  });
};

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const setMessage = (element, text, isError = false) => {
  element.textContent = text;
  element.classList.toggle("error", isError);
};

const updateNavbar = () => {
  header.classList.toggle("scrolled", window.scrollY > 42);
  mobilePurchaseBar.classList.toggle("visible", window.scrollY > 360 && !!product);
};

let revealObserver;

function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
  }

  document.querySelectorAll(".reveal:not(.visible)").forEach((item) => revealObserver.observe(item));
}

if (!product) {
  renderNotFound();
} else {
  document.body.classList.add("has-mobile-bar");
  renderGallery();
  renderVariantOptions();
  renderSummary();
  renderTab();
  renderRelatedProducts();
  renderSchema();
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();
updateCartCount();

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-panel a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-quantity]").forEach((button) => {
  button.addEventListener("click", () => {
    updateQuantity(quantity + (button.dataset.quantity === "increase" ? 1 : -1));
  });
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeTab = button.dataset.tab;
    document.querySelectorAll(".tab-button").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-selected", String(item === button));
    });
    renderTab();
  });
});

addToCart.addEventListener("click", () => addProductToCart(addToCart));
mobileAddToCart.addEventListener("click", () => addProductToCart(mobileAddToCart));
buyNow.addEventListener("click", () => {
  setLoading(buyNow, "Processing...", () => {
    window.location.href = "checkout.html";
  });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletterForm.querySelector("input");
  const message = newsletterForm.parentElement.querySelector(".form-message");

  if (!validateEmail(email.value.trim())) {
    setMessage(message, "Please enter a valid email address.", true);
    email.focus();
    return;
  }

  setMessage(message, "Thank you for subscribing.");
  newsletterForm.reset();
});

observeReveals();
