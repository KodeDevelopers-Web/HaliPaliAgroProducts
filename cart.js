const body = document.body;
const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const cartItems = document.querySelector("#cartItems");
const emptyState = document.querySelector("#emptyState");
const summaryItems = document.querySelector("#summaryItems");
const summarySubtotal = document.querySelector("#summarySubtotal");
const summaryTotal = document.querySelector("#summaryTotal");
const checkoutBtn = document.querySelector("#checkoutBtn");
const loader = document.querySelector(".loader");
const backToTop = document.querySelector(".back-to-top");

let cart = [];

body.classList.add("loading");

window.addEventListener("load", () => {
  loader.classList.add("hidden");
  body.classList.remove("loading");
});

const loadCart = () => {
  const stored = localStorage.getItem("haliPaliCart");
  cart = stored ? JSON.parse(stored) : [];
};

const saveCart = () => {
  localStorage.setItem("haliPaliCart", JSON.stringify(cart));
};

const formatPrice = (price) => {
  return `Rs. ${Number(price ||0.).toLocaleString("en-IN")}`;
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
};

const renderCart = () => {
  if (cart.length === 0) {
    cartItems.innerHTML = "";
    cartItems.hidden = true;
    document.querySelector(".cart-summary-section").hidden = true;
    emptyState.hidden = false;
    return;
  }

  cartItems.hidden = false;
  document.querySelector(".cart-summary-section").hidden = false;
  emptyState.hidden = true;

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <div class="cart-item-image">
        <img src="${item.image || ""}" alt="${item.productName || "Product"}" loading="lazy">
      </div>

      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.productName || "Product"}</h3>
        <div class="cart-item-meta">
          <span class="cart-item-category">${item.type || "Honey"}</span>
          <span>${item.variantSize || ""}</span>
        </div>
        <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
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
        cart[index].quantity -= 1;
        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
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

const updateChrome = () => {
  const scrollTop = window.scrollY;
  header.classList.toggle("scrolled", scrollTop > 42);
  backToTop.classList.toggle("visible", scrollTop > 520);
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

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length > 0) {
    alert("Checkout coming soon");
  }
});

loadCart();
renderCart();

