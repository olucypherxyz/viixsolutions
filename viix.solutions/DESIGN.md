# VIIX website design system

The Convergence Field design spans all 37 static pages: the global website, Nigeria / West Africa, Southern Africa, portfolio and case studies, and the custom 404 page.

## Maintaining the design

- `css/home.css` defines brand tokens, navigation, footer, the convergence visual and homepage sections.
- Interior pages load local Bootstrap for grid utilities, followed by `css/home.css` and `css/pages.css`. The latter defines page heroes, service grids, case studies, testimonials, team profiles and enquiry forms.
- `js/home.js` provides the responsive navigation. `js/site.js` provides keyboard-accessible service filters and Resend-backed enquiry forms. `js/region.js` preserves the existing region preference.
- Page content stays in its HTML file. Navigation and footer are static markup; update each regional version when changing shared links.
- Use root-relative local URLs. This keeps links and assets correct with the host's clean URLs and disabled trailing slashes.
- Original content, regional propositions, canonical URLs, structured data and indexing directives are retained. POSflyt and the 404 page retain their noindex directives.
- Enquiry forms POST to `/api/contact` (Vercel serverless + Resend). API keys stay server-side. Honeypot, rate limiting and duplicate guards are enforced in `api/contact.js`. See `DEPLOYMENT_CHECKLIST.md` and `env.example`.
- Without JavaScript, navigation and all service items remain visible; forms fall back to a normal POST to `/api/contact` if scripting is unavailable but will not show progressive status UI. Motion respects reduced-motion preferences.
- Use the shared SVG `arrow-up-right` icon for CTA arrows. Do not rely on Unicode `→` / `↓` glyphs for navigation or buttons (Apple platforms render those inconsistently).
- The older `_p57_*` generators produce the previous portfolio presentation. Current HTML files are the design source of truth.

## Verification

Run from this directory:

- `node scripts/verify-site.cjs` — local links, landmarks, canonicals, structured data
- `node scripts/test-contact-validation.cjs` — enquiry validation unit checks

## Capability and logo conventions

Client-facing service introduction uses five pillars: Managed IT; Web & Digital Infrastructure; Business Systems & Automation; Media & Creative Execution; Deployment & Technical Projects.

The Convergence Field visual and filters still use three connected domains — ICT, Media and Business — as the design taxonomy. Service filters, portfolio labels and regional capability maps use this taxonomy. Operations and CRM / sales support belong to Business.

Engagement models: one-time projects; standalone recurring services; Managed Services / SLA. Managed tiers are named Essential, Business, Business+, Managed and Enterprise. Public price amounts are not published on the site unless separately authorised.

The capability colors follow the original logo: ICT blue, Media yellow, Business green. Use them as restrained indicators, not body-text colors.

Use the original text logo in navigation, the full logo in footers, and the shapes logo inside the convergence visuals. Preserve the supplied colors and natural aspect ratios. Do not rebuild the wordmark with a font or stretch the artwork.
