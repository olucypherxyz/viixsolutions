/**
 * Vercel serverless enquiry endpoint.
 * Sends validated form submissions through Resend.
 *
 * Required production env (set in Vercel; do not commit secrets):
 *   RESEND_API_KEY
 *   CONTACT_FROM_EMAIL   e.g. enquiries@viix.solutions (verified domain)
 * Optional:
 *   CONTACT_TO_EMAIL     defaults to mail@viix.solutions
 *   CONTACT_RATE_LIMIT   submissions per IP per window (default 5)
 *   CONTACT_RATE_WINDOW_MS  window length (default 15 minutes)
 */

const {
  validateEnquiry,
  buildEmailContent,
} = require("../lib/server/contact-validation");

const rateBuckets = new Map();
const recentSubmissions = new Map();

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function pruneMap(map, maxAgeMs) {
  const cutoff = Date.now() - maxAgeMs;
  for (const [key, value] of map.entries()) {
    const ts = typeof value === "number" ? value : value?.ts;
    if (!ts || ts < cutoff) map.delete(key);
  }
}

function checkRateLimit(ip) {
  const limit = Number(process.env.CONTACT_RATE_LIMIT || 5);
  const windowMs = Number(process.env.CONTACT_RATE_WINDOW_MS || 15 * 60 * 1000);
  pruneMap(rateBuckets, windowMs);
  const entry = rateBuckets.get(ip) || { count: 0, ts: Date.now() };
  if (Date.now() - entry.ts > windowMs) {
    entry.count = 0;
    entry.ts = Date.now();
  }
  entry.count += 1;
  rateBuckets.set(ip, entry);
  return entry.count <= limit;
}

function isDuplicate(data) {
  const key =
    data.submissionId ||
    `${data.email}|${data.message.slice(0, 80)}|${data.region}`;
  pruneMap(recentSubmissions, 10 * 60 * 1000);
  if (recentSubmissions.has(key)) return true;
  recentSubmissions.set(key, Date.now());
  return false;
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

async function sendViaResend({ to, from, replyTo, subject, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const err = new Error("RESEND_API_KEY is not configured.");
    err.code = "CONFIG";
    throw err;
  }
  if (!from) {
    const err = new Error("CONTACT_FROM_EMAIL is not configured.");
    err.code = "CONFIG";
    throw err;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(
      payload?.message || `Resend request failed (${response.status}).`,
    );
    err.code = "RESEND";
    err.status = response.status;
    throw err;
  }
  return payload;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed." });
  }

  if (!checkRateLimit(clientIp(req))) {
    return json(res, 429, {
      ok: false,
      error: "Too many enquiries from this connection. Please try again later.",
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return json(res, 400, { ok: false, error: "Invalid JSON body." });
    }
  }

  const validated = validateEnquiry(body || {});
  if (!validated.ok) {
    return json(res, validated.status, {
      ok: false,
      error: validated.error,
      fields: validated.fields,
    });
  }

  if (isDuplicate(validated.data)) {
    return json(res, 409, {
      ok: false,
      error: "This enquiry was already submitted. Please wait before sending again.",
    });
  }

  const submittedAt = new Date().toISOString();
  const content = buildEmailContent(validated.data, submittedAt);
  const to = process.env.CONTACT_TO_EMAIL || "mail@viix.solutions";
  const from = process.env.CONTACT_FROM_EMAIL;

  try {
    const result = await sendViaResend({
      to,
      from,
      replyTo: validated.data.email,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    return json(res, 200, {
      ok: true,
      message: "Thank you. Your enquiry has been sent.",
      id: result.id || null,
    });
  } catch (error) {
    if (error.code === "CONFIG") {
      console.error("[contact]", error.message);
      return json(res, 503, {
        ok: false,
        error:
          "Enquiry delivery is temporarily unavailable. Please email mail@viix.solutions directly.",
      });
    }
    console.error("[contact] Resend failure:", error.message);
    return json(res, 502, {
      ok: false,
      error:
        "We could not send your enquiry just now. Please try again or email mail@viix.solutions.",
    });
  }
};
