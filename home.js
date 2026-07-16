/* ============================================================
   home.js — populates the "Featured upcoming events" list and
   the live status-bar line in the hero on index.html.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("featuredList");
  const statusNext = document.getElementById("statusNext");
  const statusCount = document.getElementById("statusCount");
  if (!list) return;

  const upcoming = [...VERTEX_EVENTS]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  list.innerHTML = upcoming
    .map(
      (ev) => `
      <a class="featured-row reveal" href="register.html?event=${ev.id}">
        <span class="fr-date mono">${ev.dateLabel}</span>
        <span>
          <h3>${ev.title}</h3>
          <span class="fr-venue">${CATEGORY_ICONS[ev.category] || "\u25CF"} ${ev.venue}</span>
        </span>
        <span class="fr-cat">${ev.catLabel}</span>
        <span class="btn btn-ghost btn-sm">register &rarr;</span>
      </a>`
    )
    .join("");

  if (statusNext && upcoming[0]) {
    statusNext.textContent = `${upcoming[0].title} \u00b7 ${upcoming[0].dateLabel}`;
  }
  if (statusCount) {
    statusCount.textContent = String(VERTEX_EVENTS.length);
  }

  // re-run reveal observer for dynamically injected rows
  document.querySelectorAll(".featured-row.reveal").forEach((el) => {
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
});
