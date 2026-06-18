//checkout.js
const body = document.body;
const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const deliveryForm = document.querySelector("#deliveryForm");
const checkoutContent = document.querySelector("#checkoutContent");
const emptyCheckoutState = document.querySelector("#emptyCheckoutState");
const orderItems = document.querySelector("#orderItems");
const summaryItems = document.querySelector("#summaryItems");
const summarySubtotal = document.querySelector("#summarySubtotal");
const summaryTotal = document.querySelector("#summaryTotal");
const loader = document.querySelector(".loader");
const backToTop = document.querySelector(".back-to-top");

let cart = [];

body.classList.add("loading");

window.addEventListener("load", () => {
  loader.classList.add("hidden");
  body.classList.remove("loading");
});

const loadCart = () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if (mode === "buy-now") {
    const buyNow = localStorage.getItem("haliPaliBuyNow");
    cart = buyNow ? JSON.parse(buyNow) : [];
  } else {
    const stored = localStorage.getItem("haliPaliCart");
    cart = stored ? JSON.parse(stored) : [];
  }
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
};

const renderOrderSummary = () => {
  if (cart.length === 0) {
    orderItems.innerHTML = "";
    checkoutContent.hidden = true;
    emptyCheckoutState.hidden = false;
    return;
  }

  checkoutContent.hidden = false;
  emptyCheckoutState.hidden = true;

  orderItems.innerHTML = cart.map((item) => `
    <div class="order-item">
      <div class="order-item-image">
        <img src="${item.image || ""}" alt="${item.productName || "Product"}" loading="lazy">
      </div>
      <div class="order-item-details">
        <div class="order-item-name">${item.productName || "Product"}</div>
        <div class="order-item-meta">Qty: ${item.quantity}</div>
      </div>
      <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join("");

  updateUI();
};

const validateField = (fieldName, value) => {
  value = value.trim();

  switch (fieldName) {
    case "fullName":
      if (!value) return "Please enter your full name";
      if (value.length < 3) return "Name must be at least 3 characters";
      return "";

    case "phoneNumber":
      const phoneRegex = /^\d{10}$/;
      if (!value) return "Please enter your phone number";
      if (!phoneRegex.test(value.replace(/\D/g, ""))) {
        return "Please enter a valid 10 digit mobile number";
      }
      return "";

    case "email":
      if (value === "") return "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
      return "";

    case "addressLine1":
      if (!value) return "Please enter your address";
      if (value.length < 5) return "Please enter a complete address";
      return "";

    case "addressLine2":
      return "";

    case "city":
      if (!value) return "Please enter your city";
      if (value.length < 2) return "Please enter a valid city name";
      return "";

    case "state":
      if (!value) return "Please enter your state";
      if (value.length < 2) return "Please enter a valid state name";
      return "";

    case "pincode":
      const pincodeRegex = /^\d{6}$/;
      if (!value) return "Please enter your pincode";
      if (!pincodeRegex.test(value)) return "Please enter a valid 6 digit pincode";
      return "";

    default:
      return "";
  }
};

const showFieldError = (fieldName, errorMessage) => {
  const input = document.querySelector(`#${fieldName}`);
  const errorSpan = input.parentElement.querySelector(".error-message");

  if (errorMessage) {
    input.classList.add("error");
    errorSpan.textContent = errorMessage;
  } else {
    input.classList.remove("error");
    errorSpan.textContent = "";
  }
};

const validateForm = () => {
  const fields = ["fullName", "phoneNumber", "email", "addressLine1", "addressLine2", "city", "state", "pincode"];
  let isValid = true;

  fields.forEach((fieldName) => {
    const input = document.querySelector(`#${fieldName}`);
    const value = input.value;
    const error = validateField(fieldName, value);

    showFieldError(fieldName, error);
    if (error) isValid = false;
  });

  return isValid;
};

const generateOrderId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HP-${year}-${random}`;
};

const placeOrder = async (event) => {

  const submitBtn = deliveryForm.querySelector(
  'button[type="submit"]'
  );

  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before placing an order.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Placing Order...";

  const formData = new FormData(deliveryForm);

  const customer = {
    fullName: formData.get("fullName").trim(),
    phoneNumber: formData.get("phoneNumber").trim(),
    email: formData.get("email").trim(),
    addressLine1: formData.get("addressLine1").trim(),
    addressLine2: formData.get("addressLine2").trim(),
    city: formData.get("city").trim(),
    state: formData.get("state").trim(),
    pincode: formData.get("pincode").trim(),
  };

  const { itemCount, subtotal } = calculateTotals();

  const orderData = {
    orderId: generateOrderId(),
    customer: customer,
    items: JSON.parse(JSON.stringify(cart)),
    totalItems: itemCount,
    subtotal: subtotal,
    total: subtotal,
    createdAt: new Date().toISOString(),
  };

  const itemsText = orderData.items
    .map(item => `${item.productName} (${item.quantity})`)
    .join(", ");

  const sizeText = orderData.items
    .map(item => item.variantSize || "")
    .join(", ");

  const itemPriceText = orderData.items
    .map(item => item.price || 0)
    .join(", ");

  try {

  console.log("ORDER SENT", orderData.orderId);
  console.log(orderData);
  //fetching google script to save order data in google sheet
  const response = await fetch(
  "https://script.google.com/macros/s/AKfycbwNAwk_yzBEK07O-T1XpYyDgsTf3UxZqDUIwgsYYquwxyNlZWideMmACMnpy6bevEX3vQ/exec",
  {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({
      orderId: orderData.orderId,
      date: new Date().toISOString(),

      customerName: customer.fullName,
      phone: customer.phoneNumber,
      email: customer.email,

      address:
        customer.addressLine1 +
        (customer.addressLine2
          ? ", " + customer.addressLine2
          : ""),

      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,

      products: itemsText,
      productSize: sizeText,
      productPrice: itemPriceText,

      totalItems: orderData.totalItems,
      totalCost: orderData.total,

      orderStatus: "Pending"
    })
  }
);

const result = await response.json();

if (!result.success) {
    throw new Error(result.error);
}

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(orderData)
    );

    localStorage.removeItem("haliPaliCart");
    localStorage.removeItem("haliPaliBuyNow");

    window.location.href = "order-success.html";

  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Place Order";
    console.error("Order Error:", error);
    alert(
      "Order could not be placed. Please try again."
    );
  }
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

deliveryForm.addEventListener("submit", placeOrder);

document.querySelectorAll(".form-group input").forEach((input) => {
  input.addEventListener("blur", () => {
    const fieldName = input.id;
    const value = input.value;
    const error = validateField(fieldName, value);
    showFieldError(fieldName, error);
  });
});

loadCart();
renderOrderSummary();
