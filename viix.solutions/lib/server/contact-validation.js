/**
 * Shared enquiry validation for the contact API and local tests.
 * Keep this dependency-free (CommonJS) so Vercel and Node scripts can require it.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = {
  name: 120,
  email: 254,
  phone: 40,
  company: 160,
  service: 120,
  message: 4000,
  region: 32,
};

function clean(value, max) {
  if (value == null) return "";
  return String(value).replace(/\0/g, "").trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {Record<string, unknown>} body
 * @returns {{ ok: true, data: object } | { ok: false, status: number, error: string, fields?: string[] }}
 */
function validateEnquiry(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, status: 400, error: "Invalid request body." };
  }

  // Honeypot — bots fill hidden fields; real users never see this.
  if (clean(body.website, 200) || clean(body.company_url, 200)) {
    return { ok: false, status: 400, error: "Rejected." };
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email).toLowerCase();
  const phone = clean(body.phone, MAX.phone);
  const company = clean(body.company, MAX.company);
  const service = clean(body.service, MAX.service);
  const message = clean(body.message, MAX.message);
  const region = clean(body.region, MAX.region) || "global";
  const submissionId = clean(body.submissionId, 64);

  const missing = [];
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!message) missing.push("message");
  if (missing.length) {
    return {
      ok: false,
      status: 400,
      error: "Please complete the required fields.",
      fields: missing,
    };
  }

  if (!EMAIL_RE.test(email)) {
    return {
      ok: false,
      status: 400,
      error: "Please enter a valid email address.",
      fields: ["email"],
    };
  }

  if (message.length < 10) {
    return {
      ok: false,
      status: 400,
      error: "Please add a little more detail to your message.",
      fields: ["message"],
    };
  }

  const allowedRegions = new Set(["global", "en-ng", "en-za"]);
  if (!allowedRegions.has(region)) {
    return { ok: false, status: 400, error: "Invalid region." };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      company,
      service,
      message,
      region,
      submissionId,
    },
  };
}

function regionLabel(region) {
  return (
    {
      global: "Global",
      "en-ng": "Nigeria & West Africa",
      "en-za": "Southern Africa",
    }[region] || "Global"
  );
}

function buildEmailContent(data, submittedAt) {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.company ? `Company / organisation: ${data.company}` : null,
    data.service ? `Service of interest: ${data.service}` : null,
    `Region: ${regionLabel(data.region)}`,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    data.message,
  ].filter((line) => line !== null);

  const text = lines.join("\n");
  const html = `
    <h2>Website enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    ${data.company ? `<p><strong>Company / organisation:</strong> ${escapeHtml(data.company)}</p>` : ""}
    ${data.service ? `<p><strong>Service of interest:</strong> ${escapeHtml(data.service)}</p>` : ""}
    <p><strong>Region:</strong> ${escapeHtml(regionLabel(data.region))}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
  `.trim();

  return { text, html, subject: `Website enquiry — ${regionLabel(data.region)}` };
}

module.exports = {
  validateEnquiry,
  buildEmailContent,
  regionLabel,
  escapeHtml,
};
