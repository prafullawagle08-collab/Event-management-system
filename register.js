/* ============================================================
   register.js — fills the event dropdown, validates every field
   on submit (and live, after first blur), and swaps the form
   for a success panel once the entry passes.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const eventSelect = document.getElementById("eventSelect");
  const formCard = document.getElementById("formCard");
  const successPanel = document.getElementById("successPanel");
  const successRef = document.getElementById("successRef");
  const successEvent = document.getElementById("successEvent");

  // ---- populate event dropdown from shared data ----
  eventSelect.innerHTML =
    `<option value="" disabled selected>Select an event</option>` +
    VERTEX_EVENTS.map(
      (ev) => `<option value="${ev.id}">${ev.title} \u2014 ${ev.dateLabel}</option>`
    ).join("");

  // preselect event if arrived via ?event=id link
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("event");
  if (preselect && VERTEX_EVENTS.some((e) => e.id === preselect)) {
    eventSelect.value = preselect;
  }

  // ---- validators ----
  const validators = {
    fullName: (v) => {
      if (!v.trim()) return "Enter your full name.";
      if (v.trim().length < 3) return "Name should be at least 3 characters.";
      if (!/^[a-zA-Z\s.'-]+$/.test(v.trim())) return "Use letters only, please.";
      return "";
    },
    email: (v) => {
      if (!v.trim()) return "Enter your email address.";
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
      return ok ? "" : "Enter a valid email address.";
    },
    phone: (v) => {
      const digits = v.replace(/\D/g, "");
      if (!digits) return "Enter your phone number.";
      if (digits.length < 10) return "Phone number should have at least 10 digits.";
      return "";
    },
    department: (v) => (v ? "" : "Select your department."),
    eventSelect: (v) => (v ? "" : "Choose an event to register for."),
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
    const results = Object.keys(validators).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      const firstInvalid = form.querySelector(".field.invalid");
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const chosen = VERTEX_EVENTS.find((ev) => ev.id === eventSelect.value);
    const refCode =
      "VTX-" + Math.random().toString(36).slice(2, 7).toUpperCase();

    successEvent.textContent = chosen ? chosen.title : eventSelect.value;
    successRef.textContent = refCode;
    formCard.style.display = "none";
    successPanel.classList.add("show");
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    form.reset();
  });

  document.getElementById("registerAnother")?.addEventListener("click", () => {
    successPanel.classList.remove("show");
    formCard.style.display = "block";
    document
      .querySelectorAll(".field")
      .forEach((f) => f.classList.remove("valid", "invalid"));
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
