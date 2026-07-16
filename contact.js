/* ============================================================
   contact.js — client-side validation for the contact form,
   swaps in a confirmation message on successful submit.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successPanel = document.getElementById("contactSuccess");
  const formCard = document.getElementById("contactFormCard");

  const validators = {
    contactName: (v) => (v.trim().length >= 2 ? "" : "Enter your name."),
    contactEmail: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address.",
    contactSubject: (v) => (v.trim() ? "" : "Let us know what this is about."),
    contactMessage: (v) =>
      v.trim().length >= 10 ? "" : "Message should be at least 10 characters.",
  };

  function fieldEl(name) {
    return document.getElementById(name).closest(".field");
  }

  function showError(name, message) {
    const wrap = fieldEl(name);
    const msgEl = wrap.querySelector(".error-msg");
    if (message) {
      wrap.classList.add("invalid");
      wrap.classList.remove("valid");
      msgEl.textContent = message;
    } else {
      wrap.classList.remove("invalid");
      wrap.classList.add("valid");
      msgEl.textContent = "";
    }
  }

  function validateField(name) {
    const el = document.getElementById(name);
    const message = validators[name](el.value);
    showError(name, message);
    return !message;
  }

  Object.keys(validators).forEach((name) => {
    const el = document.getElementById(name);
    el.addEventListener("blur", () => validateField(name));
    el.addEventListener("input", () => {
      if (fieldEl(name).classList.contains("invalid")) validateField(name);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(validators).map(validateField).every(Boolean);
    if (!allValid) return;

    formCard.style.display = "none";
    successPanel.classList.add("show");
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    form.reset();
  });
});
