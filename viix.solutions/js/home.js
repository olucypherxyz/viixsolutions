(() => {
  "use strict";
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");
  const mobile = window.matchMedia("(max-width: 760px)");
  function renderToggle(open) {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    const mark = document.createElement("span");
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = open ? "×" : "＋";
    button.replaceChildren(document.createTextNode(open ? "Close " : "Menu "), mark);
  }
  function closeMenu() {
    renderToggle(false);
    nav.classList.remove("is-open");
  }
  function syncMenu() {
    button.hidden = !mobile.matches;
    closeMenu();
  }
  document.documentElement.classList.add("js-ready");
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    renderToggle(open);
    nav.classList.toggle("is-open", open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      button.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      button.focus();
    }
  });
  mobile.addEventListener("change", syncMenu);
  syncMenu();
})();
