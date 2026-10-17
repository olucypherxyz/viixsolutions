/**
 * One-shot helper: rewrite enquiry forms to POST /api/contact.
 * Run: node scripts/patch-enquiry-forms.cjs
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function formMarkup({ region, idPrefix, formId }) {
  const id = (name) => `${idPrefix}${name}`;
  return `<form
                  action="/api/contact"
                  class="enquiry-form w-100"
                  data-enquiry-region="${region}"
                  id="${formId}"
                  method="post"
                >
                  <div class="enquiry-honeypot" aria-hidden="true">
                    <label for="${id("website")}">Website</label>
                    <input
                      autocomplete="off"
                      id="${id("website")}"
                      name="website"
                      tabindex="-1"
                      type="text"
                    />
                  </div>
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="field-label-text" for="${id("name")}"
                        >Your name</label
                      >
                      <input
                        autocomplete="name"
                        class="form-control bg-light border-0"
                        id="${id("name")}"
                        name="name"
                        placeholder="Your name"
                        required=""
                        type="text"
                      />
                    </div>
                    <div class="col-12">
                      <label class="field-label-text" for="${id("email")}"
                        >Your email</label
                      >
                      <input
                        autocomplete="email"
                        class="form-control bg-light border-0"
                        id="${id("email")}"
                        name="email"
                        placeholder="Your email"
                        required=""
                        type="email"
                      />
                    </div>
                    <div class="col-12">
                      <label class="field-label-text" for="${id("phone")}"
                        >Phone
                        <span class="text-muted">(optional)</span></label
                      >
                      <input
                        autocomplete="tel"
                        class="form-control bg-light border-0"
                        id="${id("phone")}"
                        name="phone"
                        placeholder="Phone number"
                        type="tel"
                      />
                    </div>
                    <div class="col-12">
                      <label class="field-label-text" for="${id("company")}"
                        >Company or organisation
                        <span class="text-muted">(optional)</span></label
                      >
                      <input
                        autocomplete="organization"
                        class="form-control bg-light border-0"
                        id="${id("company")}"
                        name="company"
                        placeholder="Company or organisation"
                        type="text"
                      />
                    </div>
                    <div class="col-12">
                      <label class="field-label-text" for="${id("service")}"
                        >Service of interest
                        <span class="text-muted">(optional)</span></label
                      >
                      <select
                        class="form-select bg-light border-0"
                        id="${id("service")}"
                        name="service"
                      >
                        <option value="">Select a service</option>
                        <option value="Managed IT">Managed IT</option>
                        <option value="Web &amp; Digital Infrastructure">
                          Web &amp; Digital Infrastructure
                        </option>
                        <option value="Business Systems &amp; Automation">
                          Business Systems &amp; Automation
                        </option>
                        <option value="Media &amp; Creative Execution">
                          Media &amp; Creative Execution
                        </option>
                        <option value="Deployment &amp; Technical Projects">
                          Deployment &amp; Technical Projects
                        </option>
                        <option value="Managed Services / SLA">
                          Managed Services / SLA
                        </option>
                        <option value="General enquiry">General enquiry</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="field-label-text" for="${id("message")}"
                        >Message</label
                      >
                      <textarea
                        class="form-control bg-light border-0"
                        id="${id("message")}"
                        name="message"
                        placeholder="Tell us briefly what you need help with"
                        required=""
                        rows="3"
                      ></textarea>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-dark w-100 py-3" type="submit">
                        Send enquiry
                        <svg
                          aria-hidden="true"
                          class="arrow-up-right"
                          fill="currentColor"
                          focusable="false"
                          height="0.6em"
                          viewBox="0 200 732 600"
                          width="0.732em"
                        >
                          <path
                            d="M350 235H637V522zM91 714 506 292 574 360 159 782z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p class="enquiry-note">
                    Your enquiry is sent securely to our team. We reply to the
                    email address you provide. Prefer email? Write to
                    <a href="mailto:mail@viix.solutions">mail@viix.solutions</a>.
                  </p>
                  <div
                    aria-live="polite"
                    class="enquiry-status"
                    hidden=""
                    role="status"
                  ></div>
                </form>`;
}

function replaceForm(html, region, idPrefix, formId) {
  const re = /<form[\s\S]*?data-enquiry-region="[^"]+"[\s\S]*?<\/form>/i;
  if (!re.test(html)) {
    throw new Error(`No enquiry form found for region ${region}`);
  }
  return html.replace(re, formMarkup({ region, idPrefix, formId }));
}

function patchNgQuote() {
  const file = path.join(root, "en-ng", "quote.html");
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(
    /<a\s+class="btn btn-primary py-3 px-5"\s+href="mailto:mail@viix\.solutions\?subject=Brand%20%26%20Visibility%20Review"\s*>Book Your Free Review →<\/a\s*>/,
    `<a class="btn btn-primary py-3 px-5" href="#ng-enquiry-form"
                >Request a Consultation
                <svg aria-hidden="true" class="arrow-up-right" fill="currentColor" focusable="false" height="0.6em" viewBox="0 200 732 600" width="0.732em"><path d="M350 235H637V522zM91 714 506 292 574 360 159 782z"/></svg>
              </a>`,
  );
  html = replaceForm(html, "en-ng", "ng-enquiry-", "ng-enquiry-form");
  fs.writeFileSync(file, html);
}

function patchZaQuote() {
  const file = path.join(root, "en-za", "quote.html");
  let html = fs.readFileSync(file, "utf8");
  html = replaceForm(html, "en-za", "za-enquiry-", "za-enquiry-form");
  fs.writeFileSync(file, html);
}

function patchContact(fileRel, region, idPrefix, formId, buttonHrefReplace) {
  const file = path.join(root, fileRel);
  let html = fs.readFileSync(file, "utf8");

  if (buttonHrefReplace) {
    html = html.replace(buttonHrefReplace.from, buttonHrefReplace.to);
  }

  if (!html.includes('data-enquiry-region=')) {
    const panel = `
          <div class="row g-5 mt-2">
            <div class="col-lg-7 mx-auto">
              <div
                class="bg-primary rounded d-flex align-items-center p-5 enquiry-panel"
              >
                ${formMarkup({ region, idPrefix, formId })}
              </div>
            </div>
          </div>`;
    // Insert before closing of the main container py-5 block's parent — after the text-center CTA or ZA cards.
    if (html.includes('class="text-center"')) {
      html = html.replace(
        /(<div class="text-center">[\s\S]*?<\/div>)/,
        `$1${panel}`,
      );
    } else if (html.includes("</div>\n        </div>\n      </div>\n    </main>")) {
      html = html.replace(
        "</div>\n        </div>\n      </div>\n    </main>",
        `${panel}\n        </div>\n      </div>\n    </main>`,
      );
    } else {
      throw new Error(`Could not find insertion point in ${fileRel}`);
    }
  } else {
    html = replaceForm(html, region, idPrefix, formId);
  }

  fs.writeFileSync(file, html);
}

patchNgQuote();
patchZaQuote();

patchContact("contact.html", "global", "contact-enquiry-", "contact-enquiry-form", {
  from: `<div class="text-center">
            <a class="btn btn-primary py-3 px-5" href="/quote"
              >Book via enquiry form</a
            >
          </div>`,
  to: `<div class="text-center">
            <a class="btn btn-primary py-3 px-5" href="#contact-enquiry-form"
              >Send an enquiry</a
            >
          </div>`,
});

patchContact("en-ng/contact.html", "en-ng", "ng-contact-", "ng-contact-form", {
  from: `<div class="text-center">
            <a class="btn btn-primary py-3 px-5" href="/en-ng/quote"
              >Book via enquiry form</a
            >
          </div>`,
  to: `<div class="text-center">
            <a class="btn btn-primary py-3 px-5" href="#ng-contact-form"
              >Send an enquiry</a
            >
          </div>`,
});

patchContact("en-za/contact.html", "en-za", "za-contact-", "za-contact-form", {
  from: `<a class="btn btn-primary py-3 px-5" href="/en-za/quote"
                  >Book a Free Assessment →</a
                >`,
  to: `<a class="btn btn-primary py-3 px-5" href="#za-contact-form"
                  >Send an enquiry
                  <svg aria-hidden="true" class="arrow-up-right" fill="currentColor" focusable="false" height="0.6em" viewBox="0 200 732 600" width="0.732em"><path d="M350 235H637V522zM91 714 506 292 574 360 159 782z"/></svg></a
                >`,
});

console.log("Patched enquiry forms.");
