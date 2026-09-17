/* Progressive enhancements shared by the global and regional content pages. */
(() => {
  "use strict";
  document.querySelectorAll(".portfolio-filters").forEach((filters) => {
    const section = filters.closest(".service-showcase");
    if (!section) return;
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      filters
        .querySelectorAll("button")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      const filter = button.dataset.filter;
      section.querySelectorAll(".portfolio-item").forEach((item) => {
        item.hidden = filter !== "*" && !item.matches(filter);
      });
    });
  });
  document.querySelectorAll("form[data-enquiry-region]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const region = {
        global: "Global",
        "en-ng": "Nigeria & West Africa",
        "en-za": "Southern Africa",
      }[form.dataset.enquiryRegion];
      const subject =
        form.dataset.enquiryRegion === "en-ng"
          ? "Brand & Visibility Review"
          : "Digital Operations Assessment";
      const fields = [...form.querySelectorAll("input, textarea, select")]
        .filter((field) => field.name && field.type !== "hidden")
        .map((field) => {
          const label = field.labels?.[0]?.textContent.trim() || field.name;
          return `${label}: ${field.value.trim()}`;
        });
      const fullSubject = `${subject} — ${region}`;
      const body = fields.join("\n\n");
      const draft = `To: mail@viix.solutions\nSubject: ${fullSubject}\n\n${body}`;
      let fallback = form.querySelector(".enquiry-fallback");
      if (!fallback) {
        fallback = document.createElement("div");
        fallback.className = "enquiry-fallback";
        fallback.innerHTML =
          "<p>If your email app did not open, copy this enquiry and send it to <a href=\"mailto:mail@viix.solutions\">mail@viix.solutions</a>.</p><pre class=\"enquiry-preview\"></pre><button class=\"btn btn-outline-primary enquiry-copy\" type=\"button\">Copy enquiry</button><p class=\"enquiry-copy-status\" hidden></p>";
        form.appendChild(fallback);
        fallback.querySelector(".enquiry-copy").addEventListener("click", async () => {
          const status = fallback.querySelector(".enquiry-copy-status");
          try {
            await navigator.clipboard.writeText(draft);
            status.hidden = false;
            status.textContent = "Copied to clipboard.";
          } catch {
            status.hidden = false;
            status.textContent = "Select the text above and copy it.";
          }
        });
      }
      fallback.querySelector(".enquiry-preview").textContent = draft;
      fallback.hidden = false;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(draft).catch(() => {});
      }
      window.location.href = `mailto:mail@viix.solutions?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
    });
  });
})();
