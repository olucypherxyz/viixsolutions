# VIIX website design system

The Convergence Field design spans all 37 static pages: the global website, Nigeria / West Africa, Southern Africa, portfolio and case studies, and the custom 404 page.

## Maintaining the design

- `css/home.css` defines brand tokens, navigation, footer, the convergence visual and homepage sections.
- Interior pages load local Bootstrap for grid utilities, followed by `css/home.css` and `css/pages.css`. The latter defines page heroes, service grids, case studies, testimonials, team profiles and enquiry forms.
- `js/home.js` provides the responsive navigation. `js/site.js` provides keyboard-accessible service filters and email-draft forms. `js/region.js` preserves the existing region preference.
- Page content stays in its HTML file. Navigation and footer are static markup; update each regional version when changing shared links.
- Use root-relative local URLs. This keeps links and assets correct with the host's clean URLs and disabled trailing slashes.
- Original content, regional propositions, canonical URLs, structured data and indexing directives are retained. POSflyt and the 404 page retain their noindex directives.
- Enquiry forms open the visitor's email app; they do not submit to a server. The button and explanatory copy state this behavior.
- Without JavaScript, navigation and all service items remain visible. Native capability disclosures work without JavaScript. Motion respects reduced-motion preferences.
- The older `_p57_*` generators produce the previous portfolio presentation. Current HTML files are the design source of truth.

## Verification

Run `node scripts/verify-site.cjs` from this directory. This checks local links and fragments, assets, page landmarks, canonical URLs, indexing directives and structured data without installing dependencies.

The redesign was also browser-checked at 320, 390, 768, 1024 and 1440 pixels across all 37 pages. Keyboard navigation, service filters, regional email-draft payloads, no-JavaScript navigation and reduced motion were checked. Automated WCAG A/AA checks returned no violations across 15 representative pages. Desktop and mobile screenshots were visually reviewed across the main layouts.

Changes are local; this work does not publish the site.

## Capability and logo conventions

The three capabilities are ICT (Technology & IT Services), Media (Digital Marketing & Media), and Business (Business Operations Management, CRM & Sales Support). Operations and CRM / sales support belong to Business; they are not separate top-level capabilities. Service filters, homepage disclosures, regional capability maps and portfolio labels use this taxonomy.

The capability colors follow the original logo: ICT blue, Media yellow, Business green. Use them as restrained indicators, not body-text colors. Portfolio capability labels describe the work's domain; existing development and R&D status disclosures remain intact.

Use the original text logo in navigation, the full logo in footers, and the shapes logo inside the convergence visuals. Preserve the supplied colors and natural aspect ratios. Do not rebuild the wordmark with a font or stretch the artwork.
