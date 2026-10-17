# VIIX Solutions — deployment checklist (enquiry / Resend)

Do **not** deploy until the items below are confirmed. This change set stops at the approval gate.

## Current blocker (2026-10-18)

Adding `viix.solutions` to Resend failed: the Resend account has reached its plan's domain limit (403). It already holds olucypher.xyz, 69resources.com and oryzune.app. One of these is needed first:

- upgrade the Resend plan, or
- remove an unused domain from that account, or
- create a separate Resend account for VIIX Solutions (fits its independent positioning).

Real delivery has not been verified. The handler code path is covered by `node scripts/test-contact-validation.cjs` with Resend stubbed.

Root mail for viix.solutions is Proton (MX `mail.protonmail.ch`, SPF `include:_spf.protonmail.ch`). Resend's records live on `send.viix.solutions` and `resend._domainkey`, so they do not touch the Proton MX or root SPF.

## Resend configuration

1. Confirm a Resend account is available for VIIX Solutions.
2. Verify a sending domain for `viix.solutions` in Resend (DNS records only for Resend’s recommended SPF/DKIM/optional DMARC alignment — do **not** alter MX / inbound mail routing for `mail@viix.solutions`).
3. Choose an authorised From address on that verified domain, e.g. `enquiries@viix.solutions` or `noreply@viix.solutions`.
4. Confirm the internal enquiry recipient remains `mail@viix.solutions` (current site canon) unless leadership explicitly changes routing.

## Vercel environment variables (Production)

| Variable | Required | Example / notes |
|---|---|---|
| `RESEND_API_KEY` | Yes | Server-only |
| `CONTACT_FROM_EMAIL` | Yes | Verified domain address |
| `CONTACT_TO_EMAIL` | No | Defaults to `mail@viix.solutions` |
| `CONTACT_RATE_LIMIT` | No | Default `5` |
| `CONTACT_RATE_WINDOW_MS` | No | Default `900000` (15 minutes) |

Copy from `env.example`. Never commit real secrets.

## Post-deploy verification

1. Submit a real enquiry from `/quote` and `/contact` (desktop + mobile).
2. Confirm the message arrives in the recipient mailbox (not only a Resend API 200).
3. Confirm Reply-To is the customer email.
4. Re-test invalid input, honeypot, and rapid duplicate submissions.
5. Confirm preview host `viixsolutions.vercel.app` remains noindex via existing `vercel.json` header.

## Content / commercial notes

- Public NGN/ZAR price amounts were intentionally **not** published. Existing site policy and Phase 4 website map both treat pricing as conversation-first.
- Managed tier **names** (Essential, Business, Business+, Managed, Enterprise) are shown conceptually without amounts.
- October 2026 Drive/Notion documents (`Website_Recommendations`, Company Profile, Canonical Catalogue/Price Book v2) were not available in connected vault sources at implementation time — reconcile before any future public pricing publication.
