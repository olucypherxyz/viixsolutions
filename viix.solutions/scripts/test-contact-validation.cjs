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
