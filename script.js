const body = document.body;
const header = document.querySelector("#siteHeader");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("#navPanel");
const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const loader = document.querySelector(".loader");

body.classList.add("loading");

window.addEventListener("load", () => {
  loader.classList.add("hidden");
  body.classList.remove("loading");
});

const updateChrome = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  header.classList.toggle("scrolled", scrollTop > 42);
  backToTop.classList.toggle("visible", scrollTop > 520);
  progress.style.width = `${percent}%`;
};

window.addEventListener("scroll", updateChrome, { passive: true });
updateChrome();

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-panel a, .site-footer a, .hero-buttons a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const target = Number(element.dataset.count);
    const suffix = target === 100 ? "%" : "+";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progressAmount = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressAmount, 3);
      element.textContent = `${Math.floor(eased * target)}${suffix}`;

      if (progressAmount < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

const testimonials = [...document.querySelectorAll(".testimonial")];
const dotsWrap = document.querySelector(".testimonial-dots");
let currentTestimonial = 0;
let testimonialTimer;

const showTestimonial = (index) => {
  currentTestimonial = (index + testimonials.length) % testimonials.length;

  testimonials.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === currentTestimonial);
  });

  dotsWrap.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentTestimonial);
  });
};

const startSlider = () => {
  testimonialTimer = window.setInterval(() => {
    showTestimonial(currentTestimonial + 1);
  }, 4200);
};

testimonials.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
  dot.addEventListener("click", () => {
    window.clearInterval(testimonialTimer);
    showTestimonial(index);
    startSlider();
  });
  dotsWrap.appendChild(dot);
});

showTestimonial(0);
startSlider();

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const setMessage = (element, text, isError = false) => {
  element.textContent = text;
  element.classList.toggle("error", isError);
};

const newsletterForm = document.querySelector(".newsletter-form");
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = newsletterForm.querySelector("input");
  const message = newsletterForm.parentElement.querySelector(".form-message");

  if (!isEmail(email.value.trim())) {
    setMessage(message, "Please enter a valid email address.", true);
    email.focus();
    return;
  }

  setMessage(message, "Thank you for joining our honey lovers community.");
  newsletterForm.reset();
});

const contactForm = document.querySelector(".contact-form");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = contactForm.querySelector("#name");
  const email = contactForm.querySelector("#email");
  const messageText = contactForm.querySelector("#message");
  const message = contactForm.querySelector(".form-message");

  if (name.value.trim().length < 2) {
    setMessage(message, "Please enter your name.", true);
    name.focus();
    return;
  }

  if (!isEmail(email.value.trim())) {
    setMessage(message, "Please enter a valid email address.", true);
    email.focus();
    return;
  }

  if (messageText.value.trim().length < 10) {
    setMessage(message, "Please write a message of at least 10 characters.", true);
    messageText.focus();
    return;
  }

  setMessage(message, "Your message has been received. We will contact you soon.");
  contactForm.reset();
});

const saveHomeProductToCart = (card) => {
  const cart = JSON.parse(localStorage.getItem("haliPaliCart") || "[]");

  const productId = card.dataset.id;
  const size = card.dataset.size;
  const price = Number(card.dataset.price);
  const image = card.dataset.image;

  const existingItem = cart.find(
    item =>
      item.productId === productId &&
      item.variantSize === size
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      productName: `Sheesham Honey ${size}`,
      type: "Honey",
      variantSize: size,
      price,
      image,
      quantity: 1
    });
  }

  localStorage.setItem("haliPaliCart", JSON.stringify(cart));
};

document.querySelectorAll(".add-cart-btn").forEach((button) => {
  button.addEventListener("click", () => {

    const card = button.closest(".product-card");

    saveHomeProductToCart(card);

    const originalText = button.textContent;

    button.textContent = "Added ✓";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1200);
  });
});

document.querySelectorAll(".buy-now-btn").forEach((button) => {
  button.addEventListener("click", () => {

    const card = button.closest(".product-card");

    const buyNowItem = [{
      productId: card.dataset.id,
      productName: `Sheesham Honey ${card.dataset.size}`,
      type: "Honey",
      variantSize: card.dataset.size,
      price: Number(card.dataset.price),
      image: card.dataset.image,
      quantity: 1
    }];

    localStorage.setItem(
      "haliPaliBuyNow",
      JSON.stringify(buyNowItem)
    );

    window.location.href = "checkout.html";
  });
});