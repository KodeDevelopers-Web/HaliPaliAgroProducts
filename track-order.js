//track-order.js

const body = document.body;
const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const trackOrderForm = document.querySelector("#trackOrderForm");
const resultCard = document.querySelector("#resultCard");
const validationError = document.querySelector("#validationError");
const successState = document.querySelector("#successState");
const errorState = document.querySelector("#errorState");
const networkErrorState = document.querySelector("#networkErrorState");
const loader = document.querySelector(".loader");
const backToTop = document.querySelector(".back-to-top");

// Google Apps Script endpoint
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxEtIGFnXKpWLUP-l12255wLQjpA2M50xqKBARm2My0TWI8ph6C08UECrWZqmq2QV65/exec";

// Status badge color mapping
const statusColors = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  packed: "#8b5cf6",
  shipped: "#10b981",
  delivered: "#047857",
  cancelled: "#dc2626",
};

// Page load handling
body.classList.add("loading");

window.addEventListener("load", () => {
  loader.classList.add("hidden");
  body.classList.remove("loading");
});

// Validate individual field
const validateField = (fieldName, value) => {
  value = value.trim();

  switch (fieldName) {
    case "orderId":
      if (!value) return "Please enter your Order ID";
      if (!value.toUpperCase().startsWith("HP-")) {
        return "Order ID should start with HP-";
      }
      return "";

    case "phoneNumber":
      const phoneRegex = /^\d{10}$/;
      if (!value) return "Please enter your phone number";
      const cleanPhone = value.replace(/\D/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        return "Please enter a valid 10 digit mobile number";
      }
      return "";

    default:
      return "";
  }
};

// Show field error
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

// Validate form
const validateForm = () => {
  const fields = ["orderId", "phoneNumber"];
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

// Hide validation error
const hideValidationError = () => {
  validationError.classList.add("hidden");
};

// Show validation error
const showValidationError = (message) => {
  document.querySelector("#validationErrorText").textContent = message;
  validationError.classList.remove("hidden");
};

// Hide all states
const hideAllStates = () => {
  successState.classList.add("hidden");
  errorState.classList.add("hidden");
  networkErrorState.classList.add("hidden");
};

// Show success state
const showSuccessState = (orderData) => {
  hideAllStates();

  document.querySelector("#resultOrderId").textContent =
    orderData.orderId;

  document.querySelector("#resultCustomerName").textContent =
    orderData.customerName;

  const statusBadge = document.querySelector("#resultStatus");
  const statusLower = orderData.status.toLowerCase();

  statusBadge.textContent = orderData.status;
  statusBadge.className = `status-badge ${statusLower}`;

  const totalCostElement =
    document.querySelector("#resultTotalCost");

  totalCostElement.textContent =
    `Rs. ${Number(orderData.totalCost || 0).toLocaleString("en-IN")}`;

  updateTimeline(statusLower);

  resultCard.classList.remove("hidden");
  successState.classList.remove("hidden");

  setTimeout(() => {
    resultCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, 100);
};

// Show error state
const showErrorState = () => {
  hideAllStates();
  resultCard.classList.remove("hidden");
  errorState.classList.remove("hidden");

  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
};

// Show network error state
const showNetworkErrorState = () => {
  hideAllStates();
  resultCard.classList.remove("hidden");
  networkErrorState.classList.remove("hidden");

  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
};

// Update timeline based on status
const updateTimeline = (status) => {
  const steps = ["pending", "processing", "packed", "shipped", "delivered"];
  const stepIndex = steps.indexOf(status);

  document.querySelectorAll(".timeline-dot").forEach((dot, index) => {
    dot.classList.remove("active");
    if (index <= stepIndex) {
      dot.classList.add("active");
    }
  });
};

// Fetch order data from Apps Script
const fetchOrderData = async (orderId, phoneNumber) => {

  const params = new URLSearchParams({
    orderId,
    phone: phoneNumber
  });

  const response = await fetch(
    `${SCRIPT_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Network Error");
  }

  return await response.json();
};

// Handle form submission
const handleFormSubmit = async (event) => {
  event.preventDefault();

  // Hide previous errors
  hideValidationError();
  hideAllStates();
  resultCard.classList.add("hidden");

  // Validate form
  if (!validateForm()) {
    return;
  }

  const orderId = document.querySelector("#orderId").value.trim();
  const phoneNumber = document.querySelector("#phoneNumber").value.trim();

  // Get submit button
  const submitBtn = trackOrderForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Checking...";

  try {
    // Fetch order data
    const orderData = await fetchOrderData(orderId, phoneNumber);

    if (orderData.found) {

  showSuccessState({
    orderId: orderData.orderId,
    customerName: orderData.customerName,
    status: orderData.status,
    totalCost: orderData.totalCost
  });

  trackOrderForm.reset();

} else {

  showErrorState();

}
  } catch (error) {
    console.error("Error tracking order:", error);
    // Show network error state
    showNetworkErrorState();
  } finally {
    // Restore button state
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
};

// Update header on scroll
const updateChrome = () => {
  const scrollTop = window.scrollY;
  header.classList.toggle("scrolled", scrollTop > 42);
  backToTop.classList.toggle("visible", scrollTop > 520);
};

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Handle back to top button click
backToTop.addEventListener("click", (event) => {
  event.preventDefault();
  scrollToTop();
});

// Add scroll event listener
window.addEventListener("scroll", updateChrome, { passive: true });

// Menu toggle
menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when clicking on nav links
document.querySelectorAll(".nav-panel a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Form validation on blur
document.querySelectorAll(".tracking-form .form-group input").forEach((input) => {
  input.addEventListener("blur", () => {
    const fieldName = input.id;
    const value = input.value;
    const error = validateField(fieldName, value);
    showFieldError(fieldName, error);
  });

  // Clear error on input
  input.addEventListener("input", () => {
    const fieldName = input.id;
    showFieldError(fieldName, "");
  });
});

// Add form submit listener
trackOrderForm.addEventListener("submit", handleFormSubmit);

// Initialize
updateChrome();
