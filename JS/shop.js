const products = [
  {
    id: "250g",
    name: "Raw Honey 250g",
    category: "Raw Honey",
    weight: "250g",
    price: "Rs. 0",
    description: "Pure natural honey harvested directly from trusted farms.",
    image: "https://images.unsplash.com/photo-1573697610008-4c72b4e9508f?q=80&w=1476&auto=format&fit=crop",
  },
  {
    id: "500g",
    name: "Raw Honey 500g",
    category: "Raw Honey",
    weight: "500g",
    price: "Rs. 0",
    description: "Rich, golden honey packed with natural nutrients.",
    image: "https://plus.unsplash.com/premium_photo-1663957861996-8093b48a22e6?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "1kg",
    name: "Raw Honey 1kg",
    category: "Raw Honey",
    weight: "1kg",
    price: "Rs. 0",
    description: "Premium quality honey perfect for families and daily use.",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "organic500",
    name: "Organic Honey 500g",
    category: "Organic Honey",
    weight: "500g",
    price: "Rs. 0",
    description: "Certified natural honey with authentic flavor.",
    image: "https://images.unsplash.com/photo-1613548058193-1cd24c1bebcf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "forest500",
    name: "Forest Honey 500g",
    category: "Forest Honey",
    weight: "500g",
    price: "Rs. 0",
    description: "Collected from natural forest environments.",
    image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "comb",
    name: "Comb Honey",
    category: "Comb Honey",
    weight: "comb",
    price: "Rs. 0",
    description: "Raw honey served directly within natural honeycomb.",
    image: "https://images.unsplash.com/photo-1642067958050-bfba120a57e2?q=80&w=1200&auto=format&fit=crop",
  },
];

const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#shopSearch");
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const clearFilter = document.querySelector(".clear-filter");
const emptyState = document.querySelector("#emptyState");
const showAllProducts = document.querySelector("#showAllProducts");
const toast = document.querySelector(".toast");
const newsletterForm = document.querySelector(".newsletter-form");

let activeCategory = "All";
let toastTimer;

const createProductCard = (product) => {
  const card = document.createElement("article");
  card.className = "product-card reveal";
  card.dataset.name = product.name;
  card.dataset.category = product.category;
  card.dataset.description = product.description;
  card.dataset.weight = product.weight;

  card.innerHTML = `
    <div class="product-image">
      <img loading="lazy" src="${product.image}" alt="${product.name}">
      <span class="category-badge">${product.category}</span>
    </div>
    <div class="product-body">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="stars" aria-label="5 out of 5 stars">*****</div>
      <div class="product-price">${product.price}</div>
      <div class="card-actions">
        <a href="product.html?id=${product.id}">View Details</a>
        <button type="button" data-product="${product.name}">Add To Cart</button>
      </div>
    </div>
  `;

  return card;
};

const renderProducts = () => {
  productGrid.innerHTML = "";
  products.forEach((product) => productGrid.appendChild(createProductCard(product)));
  observeReveals();
};

const productMatchesSearch = (product, searchTerm) => {
  const haystack = `${product.name} ${product.weight} ${product.description} ${product.category}`.toLowerCase();
  return haystack.includes(searchTerm.toLowerCase());
};

const applyFilters = () => {
  const searchTerm = searchInput.value.trim();
  const cards = [...document.querySelectorAll(".product-card")];
  let visibleCount = 0;

  cards.forEach((card) => {
    const product = products.find((item) => item.name === card.dataset.name);
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const searchMatch = !searchTerm || productMatchesSearch(product, searchTerm);
    const shouldShow = categoryMatch && searchMatch;

    card.classList.toggle("is-hiding", !shouldShow);

    window.setTimeout(() => {
      card.hidden = !shouldShow;
    }, shouldShow ? 0 : 260);

    if (shouldShow) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
};

const setActiveCategory = (category) => {
  activeCategory = category;
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.category === category);
  });
  applyFilters();
};

const resetFilters = () => {
  searchInput.value = "";
  setActiveCategory("All");
  searchInput.focus();
};

const showToast = () => {
  window.clearTimeout(toastTimer);
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
};

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const setMessage = (element, text, isError = false) => {
  element.textContent = text;
  element.classList.toggle("error", isError);
};

const updateNavbar = () => {
  header.classList.toggle("scrolled", window.scrollY > 42);
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

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

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

searchInput.addEventListener("input", applyFilters);
filterButtons.forEach((button) => button.addEventListener("click", () => setActiveCategory(button.dataset.category)));
clearFilter.addEventListener("click", resetFilters);
showAllProducts.addEventListener("click", resetFilters);

productGrid.addEventListener("click", (event) => {
  if (event.target.matches(".card-actions button")) {
    showToast();
  }
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletterForm.querySelector("input");
  const message = newsletterForm.querySelector(".form-message") || newsletterForm.parentElement.querySelector(".form-message");

  if (!email.value.trim()) {
    setMessage(message, "Please enter your email address.", true);
    email.focus();
    return;
  }

  if (!validateEmail(email.value.trim())) {
    setMessage(message, "Please enter a valid email address.", true);
    email.focus();
    return;
  }

  setMessage(message, "Thank you for subscribing.");
  newsletterForm.reset();
});

renderProducts();
observeReveals();
