const body = document.body;
const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const successContent = document.querySelector("#successContent");
const errorContent = document.querySelector("#errorContent");
const orderIdDisplay = document.querySelector("#orderIdDisplay");
const customerNameDisplay = document.querySelector("#customerNameDisplay");
const totalItemsDisplay = document.querySelector("#totalItemsDisplay");
const orderTotalDisplay = document.querySelector("#orderTotalDisplay");
const loader = document.querySelector(".loader");
const backToTop = document.querySelector(".back-to-top");

body.classList.add("loading");

window.addEventListener("load", () => {
  loader.classList.add("hidden");
  body.classList.remove("loading");
});

const formatPrice = (price) => {
  return `Rs. ${Number(price || 0).toLocaleString("en-IN")}`;
};

const loadOrderDetails = () => {
  try {
    const orderData = localStorage.getItem("lastOrder");

    if (!orderData) {
      successContent.hidden = true;
      errorContent.hidden = false;
      return;
    }

    const order = JSON.parse(orderData);

    orderIdDisplay.textContent = order.orderId || "—";
    customerNameDisplay.textContent = order.customer?.fullName || "—";
    totalItemsDisplay.textContent = String(order.totalItems || 0);
    orderTotalDisplay.textContent = formatPrice(order.total || 0);

    successContent.hidden = false;
    errorContent.hidden = true;
  } catch (error) {
    console.error("Error loading order details:", error);
    successContent.hidden = true;
    errorContent.hidden = false;
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

loadOrderDetails();
