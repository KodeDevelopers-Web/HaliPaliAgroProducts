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
let categoryButtons = filterButtons;

const createProductCard = (product) => {
  const card = document.createElement("article");
  card.className = "product-card reveal";
  card.dataset.name = product.name;
  card.dataset.category = product.type;
  card.dataset.description = product.description;
  card.dataset.sizes = productCatalog.sizes(product).join(" ");

  const primaryVariant = productCatalog.primaryVariant(product);

  card.innerHTML = `
    <div class="product-image">
      <img loading="lazy" src="${primaryVariant.image}" alt="${product.name}">
      <span class="category-badge">${product.type}</span>
    </div>
    <div class="product-body">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="stars" aria-label="${product.rating} out of 5 stars">${productCatalog.stars(product.rating)}</div>
      <div class="product-meta">Available Sizes: ${productCatalog.sizes(product).join(" • ")}</div>
      <div class="card-actions">
        <a href="product.html?id=${product.id}">View Details</a>
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

const renderCategoryFilters = () => {
  const categories = productCatalog.categories();
  const clearButton = clearFilter;

  categoryButtons.forEach((button) => button.remove());
  categories.unshift("All");

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.type = "button";
    button.dataset.category = category;
    button.textContent = category;
    button.classList.toggle("active", category === activeCategory);
    button.addEventListener("click", () => setActiveCategory(category));
    clearButton.before(button);
  });

  categoryButtons = [...document.querySelectorAll(".filter-btn")];
};

const productMatchesSearch = (product, searchTerm) => {
  const haystack = `${product.name} ${product.type} ${product.description} ${productCatalog.sizes(product).join(" ")}`.toLowerCase();
  return haystack.includes(searchTerm.toLowerCase());
};

const applyFilters = () => {
  const searchTerm = searchInput.value.trim();
  const cards = [...document.querySelectorAll(".product-card")];
  let visibleCount = 0;

  cards.forEach((card) => {
    const product = products.find((item) => item.name === card.dataset.name);
    const categoryMatch = activeCategory === "All" || product.type === activeCategory;
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
  categoryButtons.forEach((button) => {
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

renderCategoryFilters();
renderProducts();
observeReveals();
