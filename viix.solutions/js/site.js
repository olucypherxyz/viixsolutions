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

  const ARROW_SVG =
    '<svg class="arrow-up-right" width="0.732em" height="0.6em" fill="currentColor" viewBox="0 200 732 600" aria-hidden="true" focusable="false"><path d="M350 235H637V522zM91 714 506 292 574 360 159 782z"/></svg>';

  function ensureStatus(form) {
    let status = form.querySelector(".enquiry-status");
    if (!status) {
      status = document.createElement("div");
      status.className = "enquiry-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.hidden = true;
      form.appendChild(status);
    }
    return status;
  }

  function setStatus(form, type, message) {
    const status = ensureStatus(form);
    status.hidden = !message;
    status.className = `enquiry-status${type ? ` enquiry-status--${type}` : ""}`;
    status.textContent = message || "";
  }

  function fieldValue(form, name) {
    const field = form.elements.namedItem(name);
    if (!field) return "";
    return String(field.value || "").trim();
  }

  function markInvalid(form, fields) {
    form.querySelectorAll("[aria-invalid]").forEach((el) => {
      el.removeAttribute("aria-invalid");
    });
    (fields || []).forEach((name) => {
      const field = form.elements.namedItem(name);
      if (field && "setAttribute" in field) {
        field.setAttribute("aria-invalid", "true");
      }
    });
  }

  document.querySelectorAll("form[data-enquiry-region]").forEach((form) => {
    let inFlight = false;
    let lastPayloadKey = "";
    let lastPayloadAt = 0;

    form.setAttribute("novalidate", "");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (inFlight) return;

      const submitButton = form.querySelector('[type="submit"]');
      const region = form.dataset.enquiryRegion || "global";
      const payload = {
        name: fieldValue(form, "name"),
        email: fieldValue(form, "email"),
        phone: fieldValue(form, "phone"),
        company: fieldValue(form, "company"),
        service: fieldValue(form, "service"),
        message: fieldValue(form, "message"),
        website: fieldValue(form, "website"),
        region,
        submissionId:
          (typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      };

      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus(form, "error", "Please complete the highlighted fields.");
        return;
      }

      const payloadKey = `${payload.email}|${payload.message}|${payload.region}`;
      if (
        payloadKey === lastPayloadKey &&
        Date.now() - lastPayloadAt < 60_000
      ) {
        setStatus(
          form,
          "error",
          "This enquiry was already submitted. Please wait before sending again.",
        );
        return;
      }

      inFlight = true;
      markInvalid(form, []);
      setStatus(form, "pending", "Sending your enquiry…");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {
          markInvalid(form, result.fields);
          setStatus(
            form,
            "error",
            result.error ||
              "We could not send your enquiry. Please try again or email mail@viix.solutions.",
          );
          return;
        }

        lastPayloadKey = payloadKey;
        lastPayloadAt = Date.now();
        form.reset();
        setStatus(
          form,
          "success",
          result.message || "Thank you. Your enquiry has been sent.",
        );
      } catch {
        setStatus(
          form,
          "error",
          "Network error. Please try again or email mail@viix.solutions.",
        );
      } finally {
        inFlight = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }
    });
  });

  // Expose for optional diagnostics; unused by pages.
  window.__viixEnquiry = { arrow: ARROW_SVG };
})();
