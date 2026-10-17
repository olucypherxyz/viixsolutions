/**
 * Local validation tests for the enquiry API helper.
 * Run: node scripts/test-contact-validation.cjs
 */
const assert = require("assert");
const {
  validateEnquiry,
  buildEmailContent,
} = require("../lib/server/contact-validation");

function pass(name) {
  console.log(`PASS  ${name}`);
}

{
  const result = validateEnquiry({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "We need managed IT support for a 12-person team.",
    region: "global",
  });
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.data.email, "ada@example.com");
  pass("accepts valid enquiry");
}

{
  const result = validateEnquiry({
    name: "",
    email: "ada@example.com",
    message: "Enough detail here.",
  });
  assert.strictEqual(result.ok, false);
  assert.ok(result.fields.includes("name"));
  pass("rejects missing required fields");
}

{
  const result = validateEnquiry({
    name: "Ada",
    email: "not-an-email",
    message: "Enough detail here.",
  });
  assert.strictEqual(result.ok, false);
  assert.ok(result.fields.includes("email"));
  pass("rejects invalid email");
}

{
  const result = validateEnquiry({
    name: "Ada",
    email: "ada@example.com",
    message: "short",
  });
  assert.strictEqual(result.ok, false);
  pass("rejects short message");
}

{
  const result = validateEnquiry({
    name: "Ada",
    email: "ada@example.com",
    message: "We need help with website hosting and support.",
    website: "http://spam.example",
  });
  assert.strictEqual(result.ok, false);
  pass("rejects honeypot fill");
}

{
  const result = validateEnquiry({
    name: "Ada",
    email: "ada@example.com",
    message: "We need help with website hosting and support.",
    region: "mars",
  });
  assert.strictEqual(result.ok, false);
  pass("rejects invalid region");
}

{
  const content = buildEmailContent(
    {
      name: "Ada",
      email: "ada@example.com",
      phone: "+234000",
      company: "Analytical Engines",
      service: "Managed IT",
      message: "Please call us.",
      region: "en-ng",
    },
    "2026-10-18T00:00:00.000Z",
  );
  assert.match(content.subject, /Nigeria/);
  assert.match(content.text, /Phone: \+234000/);
  assert.match(content.html, /Analytical Engines/);
  pass("builds email content with optional fields");
}

console.log("\nAll contact validation tests passed.");

// Handler-level checks with Resend stubbed out (no network, no real key).
(async () => {
  const handler = require("../api/contact");

  function call(body, env = {}) {
    Object.assign(process.env, env);
    return new Promise((resolve) => {
      const res = {
        statusCode: 200,
        headers: {},
        setHeader(k, v) {
          this.headers[k.toLowerCase()] = v;
        },
        end(payload) {
          resolve({ status: this.statusCode, body: payload ? JSON.parse(payload) : null });
        },
      };
      handler(
        { method: "POST", headers: { "x-forwarded-for": `10.0.0.${Math.random()}` }, body, socket: {} },
        res,
      );
    });
  }

  const enquiry = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "We need a website rebuild and managed IT support.",
    service: "Web & Digital Infrastructure",
    region: "en-za",
  };

  delete process.env.RESEND_API_KEY;
  let r = await call({ ...enquiry, submissionId: "t1" });
  assert.strictEqual(r.status, 503);
  pass("returns 503 when Resend is not configured");

  let sent;
  global.fetch = async (url, init) => {
    sent = { url, init: { ...init, body: JSON.parse(init.body) } };
    return { ok: true, status: 200, json: async () => ({ id: "stub-id" }) };
  };
  r = await call(
    { ...enquiry, submissionId: "t2" },
    { RESEND_API_KEY: "test-key", CONTACT_FROM_EMAIL: "enquiries@viix.solutions" },
  );
  assert.strictEqual(r.status, 200);
  assert.strictEqual(sent.url, "https://api.resend.com/emails");
  assert.deepStrictEqual(sent.init.body.to, ["mail@viix.solutions"]);
  assert.strictEqual(sent.init.body.reply_to, "ada@example.com");
  assert.strictEqual(sent.init.body.from, "enquiries@viix.solutions");
  assert.match(sent.init.body.subject, /Southern Africa/);
  pass("sends through Resend with reply-to and region subject");

  r = await call({ ...enquiry, submissionId: "t2" });
  assert.strictEqual(r.status, 409);
  pass("rejects duplicate submission");

  global.fetch = async () => ({ ok: false, status: 422, json: async () => ({ message: "domain not verified" }) });
  r = await call({ ...enquiry, submissionId: "t3" });
  assert.strictEqual(r.status, 502);
  pass("returns 502 when Resend rejects the send");

  console.log("\nAll contact handler tests passed.");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
