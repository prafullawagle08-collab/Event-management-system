/* ============================================================
   events.js — renders the event-card grid on events.html and
   handles the category filter chips.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("eventGrid");
  const filterBar = document.getElementById("filterBar");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;

  const categories = ["all", ...new Set(VERTEX_EVENTS.map((e) => e.category))];
  const labelFor = (cat) =>
    cat === "all" ? "All events" : VERTEX_EVENTS.find((e) => e.category === cat).catLabel;

  filterBar.innerHTML = categories
    .map(
      (cat, i) =>
        `<button class="filter-chip${i === 0 ? " active" : ""}" data-cat="${cat}">${labelFor(cat)}</button>`
    )
    .join("");

  function render(filter) {
    const items = VERTEX_EVENTS.filter((e) => filter === "all" || e.category === filter);
    emptyState.style.display = items.length ? "none" : "block";

    grid.innerHTML = items
      .map(
        (ev) => `
        <article class="event-card reveal" data-cat="${ev.category}">
          <span class="cat-tag">${CATEGORY_ICONS[ev.category] || ""} ${ev.catLabel}</span>
          <h3>${ev.title}</h3>
          <p class="desc">${ev.desc}</p>
          <div class="meta">
            <span data-icon="\u{1F4C5}">${ev.dateLabel}</span>
            <span data-icon="\u{1F550}">${ev.time}</span>
            <span data-icon="\u{1F4CD}">${ev.venue}</span>
          </div>
          <div class="card-actions">
            <span class="seats">${ev.seats}</span>
            <a class="btn btn-primary btn-sm" href="register.html?event=${ev.id}">Register</a>
          </div>
        </article>`
      )
      .join("");

    grid.querySelectorAll(".reveal").forEach((el) => {
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in-view");
              io.unobserve(e.target);
            }
          });
        }, { threshold: 0.1 });
        io.observe(el);
      } else {
        el.classList.add("in-view");
      }
    });
  }

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.cat);
  });

  render("all");
});
