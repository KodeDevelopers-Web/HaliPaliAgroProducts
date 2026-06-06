const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const cartContainer = document.querySelector("#cartContainer");
const cartItems = document.querySelector("#cartItems");
const emptyState = document.querySelector("#emptyState");
const summaryItems = document.querySelector("#summaryItems");
const summarySubtotal = document.querySelector("#summarySubtotal");
const summaryTotal = document.querySelector("#summaryTotal");
const cartSubtitle = document.querySelector("#cartSubtitle");
const checkoutBtn = document.querySelector("#checkoutBtn");

let cart = [];

const loadCart = () => {
  const stored = localStorage.getItem("haliPaliCart");
  cart = stored ? JSON.parse(stored) : [];
};

const saveCart = () => {
  localStorage.setItem("haliPaliCart", JSON.stringify(cart));
};

const formatPrice = (price) => {
  return `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;
};

const calculateTotals = () => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { itemCount, subtotal };
};

const updateUI = () => {
  const { itemCount, subtotal } = calculateTotals();

  summaryItems.textContent = String(itemCount);
  summarySubtotal.textContent = formatPrice(subtotal);
  summaryTotal.textContent = formatPrice(subtotal);
  cartSubtitle.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
};

const renderCart = () => {
  if (cart.length === 0) {
    cartContainer.hidden = true;
    emptyState.hidden = false;
    return;
  }

  cartContainer.hidden = false;
  emptyState.hidden = true;

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <div class="cart-item-image">
        <img src="${item.image || ""}" alt="${item.productName || ""}" loading="lazy">
      </div>

      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.productName || "Product"}</h3>
        <div class="cart-item-meta">
          <span class="cart-item-category">${item.type || "Honey"}</span>
          <span>${item.variantSize || ""}</span>
        </div>
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
      </div>

      <div class="cart-item-actions">
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-controls">
          <button class="quantity-btn decrease-qty" data-index="${index}" type="button" aria-label="Decrease quantity">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn increase-qty" data-index="${index}" type="button" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-btn" data-index="${index}" type="button">Remove</button>
      </div>
    </div>
  `).join("");

  attachEventListeners();
  updateUI();
};

const attachEventListeners = () => {
  document.querySelectorAll(".decrease-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity - 1);
        saveCart();
        renderCart();
      }
    });
  });

  document.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      if (cart[index]) {
        cart[index].quantity += 1;
        saveCart();
        renderCart();
      }
    });
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      cart.splice(index, 1);
      saveCart();
      renderCart();
    });
  });
};

const setupHeader = () => {
  const updateChrome = () => {
    header.classList.toggle("scrolled", window.scrollY > 42);
  };

  window.addEventListener("scroll", updateChrome, { passive: true });
  updateChrome();

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
};

const setupFooter = () => {
  const footer = document.querySelector(".site-footer");
  footer.innerHTML = `
    <div>
      <a class="brand" href="index.html"><span class="brand-mark">HP</span><span>Hali Pali Agro Products</span></a>
      <p>Pure natural honey and farm fresh goodness from Haryana, India.</p>
    </div>
    <div>
      <h3>Quick Links</h3>
      <a href="index.html#home">Home</a>
      <a href="shop.html">Shop</a>
      <a href="index.html#products">Products</a>
      <a href="index.html#about">About</a>
      <a href="index.html#contact">Contact</a>
    </div>
    <div>
      <h3>Social</h3>
      <a href="#" aria-label="Instagram">Instagram</a>
      <a href="#" aria-label="Facebook">Facebook</a>
    </div>
    <p class="copyright">
      &copy; 2026 Hali Pali Agro Products. All Rights Reserved.
      Website made by <a href="https://kodedevelopers.org" target="_blank" rel="noopener noreferrer">Kode Developers</a>
    </p>
  `;
};

const setupCheckout = () => {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      alert("Checkout coming soon");
    }
  });
};

const setupBackToTop = () => {
  const backToTop = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 520);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();
  setupHeader();
  setupFooter();
  setupCheckout();
  setupBackToTop();
});
