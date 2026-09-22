const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const closeMenu = () => {
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.querySelector("span").textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
});
if (localStorage.getItem("portfolio-theme") === "dark") themeToggle.click();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    formStatus.textContent = "Please complete all fields with valid information.";
    return;
  }
  formStatus.textContent = "Thanks! Your message has been submitted.";
  form.reset();
});

const sections = document.querySelectorAll("main section");
const updateActiveLink = () => {
  const current = [...sections].find((section) => window.scrollY >= section.offsetTop - 150);
  navLinks.forEach((link) => link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`));
};
window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();
