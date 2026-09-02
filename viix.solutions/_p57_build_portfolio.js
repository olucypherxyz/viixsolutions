/**
 * Phase 5.7 — generate portfolio.html and portfolio/{slug}.html
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORTFOLIO_DIR = path.join(ROOT, "portfolio");
const SITE = "https://www.viix.solutions";
const OG_IMAGE = `${SITE}/img/logo/viixlogofull.png`;
const FONT_URL =
  "https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Montserrat:300,400,500,600,700&display=swap";

const INDEX_META = {
  title: "VIIX Solutions Portfolio | Technology Digital Growth & Managed Services",
  description:
    "Explore selected VIIX Solutions projects across technology, digital growth, business systems and managed services, with evidence-led case studies showing how VIIX supports organisations and builds practical digital solutions.",
  canonical: `${SITE}/portfolio`,
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "VIIX Solutions",
    url: `${SITE}/`,
    logo: { "@type": "ImageObject", url: OG_IMAGE },
    email: "mail@viix.solutions",
    telephone: ["+27-74-534-3074", "+234-707-794-5545"],
  };
}

const CASE_STUDIES = [
  {
    id: "P5-001",
    slug: "sunshine-macaroni",
    name: "Sunshine Macaroni",
    template: "client",
    featured: true,
    indexFeatured: true,
    categoryLabel: "Client engagement",
    descriptor: "Multi-project technology work since 2019",
    geography: "Johannesburg, South Africa",
    seo: {
      title: "Sunshine Macaroni | Technology & IT Projects | VIIX Solutions",
      description:
        "Explore VIIX's technology work with Sunshine Macaroni, including documented infrastructure, Microsoft 365, IT support, CCTV and related technology projects since 2019.",
    },
    services: [{ href: "/en-za/service", label: "Technology & IT Services" }],
    related: [{ slug: "pjs-foods", name: "PJS Foods" }],
    testimonial: {
      quote:
        "Working with the VIIX Solutions team was a pleasure. They were professional, communicated well, and offered several options to address our needs.",
      attribution: "Ebraheem Abdoola",
    },
    context:
      "Sunshine Macaroni is a food manufacturing business in Johannesburg with ongoing operational technology needs across administration, production support, and site security.",
    intervention:
      "VIIX has supported Sunshine Macaroni through multiple discrete technology projects since 2019 — including Microsoft 365 administration, network infrastructure, CCTV, IT support, managed infrastructure, and hardware — rather than as a single uninterrupted managed-services contract.",
    delivered:
      "Documented delivery spans Microsoft 365, networking, CCTV, day-to-day IT support, infrastructure management, and related hardware work as separate scoped engagements.",
    outcome: null,
    robots: null,
  },
  {
    id: "P5-002",
    slug: "pjs-foods",
    name: "PJS Foods",
    template: "client",
    featured: true,
    indexFeatured: false,
    categoryLabel: "Client engagement",
    descriptor: "Technology optimisation and restored usability",
    geography: "South Africa",
    seo: {
      title: "PJS Foods | Technology Optimisation & IT Support | VIIX Solutions",
      description:
        "See how VIIX supported PJS Foods with computer upgrades, system optimisation, procurement and configuration, including a documented qualitative improvement in usability and productivity.",
    },
    services: [{ href: "/en-za/service", label: "Technology & IT Services" }],
    related: [{ slug: "sunshine-macaroni", name: "Sunshine Macaroni" }],
    testimonial: null,
    context:
      "PJS Foods needed reliable, business-usable computer systems after hardware and operating-system issues were affecting everyday work.",
    intervention:
      "VIIX delivered hardware upgrades, operating-system optimisation, procurement, and configuration so existing machines could be put back into productive use.",
    delivered: "Hardware upgrades, optimised OS deployment, procurement, and configuration of computer systems.",
    outcome:
      "Existing computers became usable again, with a documented qualitative improvement in usability and productivity — without quantified metrics.",
    robots: null,
  },
  {
    id: "P5-003",
    slug: "cdr-electrical",
    name: "CDR Electrical",
    template: "client",
    featured: true,
    indexFeatured: true,
    categoryLabel: "Client engagement",
    descriptor: "Brand, website, and technology across phases",
    geography: "South Africa",
    seo: {
      title: "CDR Electrical | Brand Website & Technology Work | VIIX Solutions",
      description:
        "Explore VIIX's documented work with CDR Electrical across technology and digital presence, with the project kept separate from CDR Technical.",
    },
    services: [
      { href: "/en-za/service", label: "Technology & IT Services" },
      { href: "/en-ng/service", label: "Digital Marketing & Media" },
    ],
    related: [],
    testimonial: {
      quote:
        "VIIX Solutions has been working on our website for a couple of months now and we're glad to have them on board — smooth process so far.",
      attribution: "Davison Makoni",
    },
    context:
      "CDR Electrical is an engineering-sector client with needs spanning digital presence, brand identity, and practical technology setup across a multi-phase relationship.",
    intervention:
      "VIIX delivered brand identity, website development, IT support, procurement, and technology setup work documented across phases. This engagement is presented separately from CDR Technical.",
    delivered: "Brand identity, website, IT support, procurement, and technology setup — activity and output focused.",
    outcome: null,
    robots: null,
  },
  {
    id: "P5-004",
    slug: "living-vine-ministries",
    name: "Living Vine Ministries",
    template: "client",
    featured: false,
    indexFeatured: false,
    categoryLabel: "Client engagement",
    descriptor: "Procurement, infrastructure, and ongoing support",
    geography: "Johannesburg, South Africa",
    seo: {
      title: "Living Vine Ministries | Technology & IT Support | VIIX Solutions",
      description:
        "Explore VIIX's technology procurement, deployment, infrastructure and ongoing support work with Living Vine Ministries in Johannesburg.",
    },
    services: [{ href: "/en-za/service", label: "Technology & IT Services" }],
    related: [],
    testimonial: {
      quote:
        "VIIX worked with us to achieve our unique requirements. They were responsive, flexible, and always willing to go the extra mile.",
      attribution: "Pastor Clifton Wagner",
    },
    context:
      "Living Vine Ministries required dependable technology for communication and administration at its Johannesburg base.",
    intervention:
      "VIIX supported IT procurement, deployment, infrastructure setup, and ongoing technology support aligned to the organisation's operational needs.",
    delivered: "Procured and deployed IT infrastructure with ongoing support — delivery-led documentation without efficiency or financial outcome claims.",
    outcome: null,
    robots: null,
  },
  {
    id: "P5-006",
    slug: "cdr-technical",
    name: "CDR Technical",
    template: "client",
    featured: false,
    indexFeatured: false,
    categoryLabel: "Client engagement",
    descriptor: "Branding and website design through deployment",
    geography: "South Africa",
    seo: {
      title: "CDR Technical | Branding & Website Development | VIIX Solutions",
      description:
        "Explore VIIX's documented branding and website design, development and deployment work for CDR Technical.",
    },
    services: [{ href: "/en-ng/service", label: "Digital Marketing & Media" }],
    related: [],
    testimonial: null,
    context:
      "CDR Technical needed a credible digital presence reflecting its engineering focus, distinct from CDR Electrical.",
    intervention:
      "VIIX delivered branding, website strategy, design, development, and deployment — documented as design and build work, not search-engine optimisation services.",
    delivered: "Branding, website design, development, and deployment outputs.",
    outcome: null,
    robots: null,
    noSeoCopy: true,
    heroImage: "img/portfolio/cdr-technical.jpg",
    heroImageAlt: "CDR Technical website homepage featuring construction industry services",
  },
  {
    id: "P5-007",
    slug: "sisonke-africa",
    name: "Sisonke Africa",
    template: "client",
    featured: false,
    indexFeatured: false,
    categoryLabel: "Client engagement",
    descriptor: "Branding and website delivery",
    geography: "South Africa",
    seo: {
      title: "Sisonke Africa | Branding & Website Development | VIIX Solutions",
      description:
        "Explore VIIX's documented branding and website design, development and deployment work for Sisonke Africa.",
    },
    services: [{ href: "/en-ng/service", label: "Digital Marketing & Media" }],
    related: [],
    testimonial: null,
    context: "Sisonke Africa required branding and a website aligned to its organisational positioning.",
    intervention:
      "VIIX delivered website design, development, deployment, and branding work — presented as delivery evidence without search-performance claims.",
    delivered: "Website design, development, deployment, and branding.",
    outcome: null,
    robots: null,
    noSeoCopy: true,
    heroImage: "img/portfolio/sisonke-africa.jpg",
    heroImageAlt: "Sisonke Africa Energy website homepage",
  },
  {
    id: "P5-009",
    slug: "vessa",
    name: "VESSA",
    template: "product",
    featured: true,
    indexFeatured: true,
    categoryLabel: "VIIX product",
    descriptor: "Business systems product in development",
    geography: null,
    seo: {
      title: "VESSA | Business Systems Product Development | VIIX Solutions",
      description:
        "Explore VESSA, a VIIX-owned product development effort focused on practical business systems and technology architecture for SMEs. Commercial adoption is not claimed.",
    },
    services: [{ href: "/service", label: "Technology & IT Services" }],
    related: [],
    testimonial: null,
    context:
      "VESSA is a VIIX-owned product initiative exploring practical business systems and technology architecture for small and medium enterprises.",
    intervention:
      "VIIX is engineering product architecture and development-stage builds — documenting systems thinking and implementation approach while the product remains in development.",
    delivered: "Architecture and development-stage product evidence; commercial adoption is not claimed.",
    outcome: null,
    limitation:
      "VESSA is in development. VIIX does not claim commercial adoption, paying customers, revenue, or market deployment for this product.",
    robots: null,
    heroImage: "img/portfolio/vessa.png",
    heroImageAlt: "VESSA product module overview showing foundation and phased business system layers",
  },
  {
    id: "P5-010",
    slug: "posflyt",
    name: "POSflyt",
    template: "rnd",
    featured: false,
    indexFeatured: false,
    categoryLabel: "Independent R&D",
    descriptor: "Business-management software research",
    geography: null,
    seo: {
      title: "POSflyt | Independent R&D & Technology Development | VIIX Solutions",
      description:
        "Explore POSflyt as independent/R&D technology work related to business-management software thinking. It is not presented as client work.",
    },
    services: [{ href: "/service", label: "Technology & IT Services" }],
    related: [],
    testimonial: null,
    context:
      "POSflyt captures independent research and development thinking around business-management software — separate from client engagements.",
    intervention:
      "VIIX documented technical approach and implementation exploration as R&D. POSflyt is never presented as client work or a deployed commercial product.",
    delivered: "R&D and technical documentation only.",
    outcome: null,
    limitation:
      "POSflyt is independent R&D. It is not client work and does not imply commercial deployment or customer adoption.",
    robots: "noindex, follow",
    heroImage: "img/portfolio/posflyt.png",
    heroImageAlt: "POSflyt point-of-sale and inventory management platform homepage",
  },
];

const LDR_CARD = {
  id: "P5-011",
  name: "LDR",
  categoryLabel: "Development",
  descriptor: "Logistics software architecture in development",
};

function prefixForDepth(depth) {
  return depth === 0 ? "" : "../";
}

function navHtml(depth, active) {
  const p = prefixForDepth(depth);
  const link = (href, label, key) => {
    const cls = active === key ? "nav-item nav-link active" : "nav-item nav-link";
    return `<a href="${p}${href}" class="${cls}">${label}</a>`;
  };
  return `
                    ${link("./", "Home", "home")}
                    ${link("about", "About", "about")}
                    ${link("portfolio", "Portfolio", "portfolio")}
                    ${link("service", "Services", "service")}
                    ${link("feature", "How We Work", "feature")}
                    ${link("price", "Investment", "price")}
                    ${link("testimonial", "Track Record", "testimonial")}
                    ${link("team", "Team", "team")}
                    ${link("contact", "Contact", "contact")}`;
}

function topbarHtml(depth) {
  const p = prefixForDepth(depth);
  return `    <div class="container-fluid bg-dark px-5 d-none d-xl-block">
        <div class="row gx-0">
            <div class="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
                <div class="d-inline-flex align-items-center" style="height: 45px;">
                    <small class="me-3 text-light"><i class="fa fa-envelope-open me-2"></i>mail@viix.solutions</small>
                    <small class="me-3 text-light"><i class="fa fa-phone-alt me-2"></i>SA +27 74 534 3074</small>
                    <small class="text-light"><i class="fa fa-phone-alt me-2"></i>NG +234 707 794 5545</small>
                </div>
            </div>
            <div class="col-lg-4 text-center text-lg-end">
                <div class="d-inline-flex align-items-center region-switcher-nav" style="height: 45px;">
                    <a class="me-2" href="${p}en-ng" data-viix-region="en-ng">Nigeria</a>
                    <span class="text-light me-2">|</span>
                    <a href="${p}en-za" data-viix-region="en-za">Southern Africa</a>
                </div>
            </div>
        </div>
    </div>`;
}

function footerHtml(depth) {
  const p = prefixForDepth(depth);
  return `    <div class="container-fluid bg-dark text-light mt-5 wow fadeInUp" data-wow-delay="0.1s">
        <div class="container py-5">
            <div class="row g-5">
                <div class="col-lg-5">
                    <a href="${p}./" class="d-inline-block mb-3">
                        <img src="${p}img/logo/viixlogofull.png" alt="VIIX Solutions" class="brand-logo brand-logo-footer">
                    </a>
                    <p class="mb-4">Leveling the Digital Playing Field for You, One Byte at a Time.</p>
                    <p class="mb-2"><i class="bi bi-envelope-open text-primary me-2"></i>mail@viix.solutions</p>
                    <p class="mb-2"><i class="bi bi-telephone text-primary me-2"></i>South Africa: +27 74 534 3074</p>
                    <p class="mb-2"><i class="bi bi-telephone text-primary me-2"></i>Nigeria: +234 707 794 5545</p>
                </div>
                <div class="col-lg-4">
                    <h4 class="text-light mb-4">Regional Sites</h4>
                    <div class="link-animated d-flex flex-column justify-content-start">
                        <a class="text-light mb-2" href="${p}en-ng" data-viix-region="en-ng"><i class="bi bi-arrow-right text-primary me-2"></i>Nigeria &amp; West Africa</a>
                        <a class="text-light mb-2" href="${p}en-za" data-viix-region="en-za"><i class="bi bi-arrow-right text-primary me-2"></i>Southern Africa</a>
                        <a class="text-light mb-2" href="${p}./" data-viix-region="global"><i class="bi bi-arrow-right text-primary me-2"></i>Global overview</a>
                    </div>
                </div>
                <div class="col-lg-3">
                    <h4 class="text-light mb-4">Quick Links</h4>
                    <div class="link-animated d-flex flex-column justify-content-start">
                        <a class="text-light mb-2" href="${p}./"><i class="bi bi-arrow-right text-primary me-2"></i>Home</a>
                        <a class="text-light mb-2" href="${p}about"><i class="bi bi-arrow-right text-primary me-2"></i>About</a>
                        <a class="text-light mb-2" href="${p}portfolio"><i class="bi bi-arrow-right text-primary me-2"></i>Portfolio</a>
                        <a class="text-light mb-2" href="${p}service"><i class="bi bi-arrow-right text-primary me-2"></i>Services</a>
                        <a class="text-light" href="${p}contact"><i class="bi bi-arrow-right text-primary me-2"></i>Contact</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid text-white" style="background: #050505;">
        <div class="container text-center">
            <div class="d-flex align-items-center justify-content-center" style="height: 75px;">
                <p class="mb-0">&copy; <a class="text-white border-bottom" href="${SITE}/">VIIX Solutions</a>. All Rights Reserved.</p>
            </div>
        </div>
    </div>`;
}

function scriptsHtml(depth) {
  const p = prefixForDepth(depth);
  return `    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="${p}lib/wow/wow.min.js"></script>
    <script src="${p}lib/easing/easing.min.js"></script>
    <script src="${p}lib/waypoints/waypoints.min.js"></script>
    <script src="${p}lib/counterup/counterup.min.js"></script>
    <script src="${p}lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="${p}js/main.js"></script>
    <script src="${p}js/region.js"></script>`;
}

function headAssets(depth) {
  const p = prefixForDepth(depth);
  return `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${FONT_URL}" rel="stylesheet">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <link href="${p}lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="${p}lib/animate/animate.min.css" rel="stylesheet">

    <link href="${p}css/bootstrap.min.css" rel="stylesheet">
    <link href="${p}css/style.css" rel="stylesheet">`;
}

function seoBlock({ title, description, canonical, robots, jsonLdArray }) {
  const robotsTag = robots ? `\n    <meta name="robots" content="${esc(robots)}">` : "";
  const blocks = jsonLdArray
    .map((obj) => `    <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n    </script>`)
    .join("\n");
  return `    <!-- PHASE2-SEO-START -->
    <link rel="canonical" href="${esc(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="VIIX Solutions">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${esc(canonical)}">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${OG_IMAGE}">${robotsTag}
${blocks}
    <!-- PHASE2-SEO-END -->`;
}

function placeholderFigure(label) {
  return `<figure class="portfolio-figure-placeholder" aria-label="${esc(label)} — visual pending">
                        <i class="fas fa-image" aria-hidden="true"></i>
                    </figure>`;
}

function projectFigure(project, depth, variant = "card") {
  const p = prefixForDepth(depth);
  if (project.heroImage) {
    const alt = project.heroImageAlt || `${project.name} project visual`;
    const cls = variant === "hero" ? "portfolio-figure portfolio-figure--hero" : "portfolio-figure";
    return `<figure class="${cls}">
                        <img src="${p}${esc(project.heroImage)}" alt="${esc(alt)}" loading="lazy">
                    </figure>`;
  }
  return placeholderFigure(project.name);
}

function visualPendingNote(project) {
  if (project.heroImage) return "";
  return `<p class="small text-muted mb-0">Project visuals are pending owner-supplied assets. This placeholder maintains layout without using unapproved screenshots.</p>`;
}

function portfolioCard(project, depth) {
  const p = prefixForDepth(depth);
  const href = `${p}portfolio/${project.slug}`;
  const meta = project.geography
    ? `<p class="text-muted small mb-2">${esc(project.descriptor)} · ${esc(project.geography)}</p>`
    : `<p class="text-muted small mb-2">${esc(project.descriptor)}</p>`;
  return `                <div class="col-lg-4 col-md-6 portfolio-item wow fadeInUp" data-wow-delay="0.1s">
                    <a href="${href}" class="portfolio-card d-block text-decoration-none h-100">
                        ${projectFigure(project, depth)}
                        <div class="portfolio-info">
                            <h4>${esc(project.name)}</h4>
                            <p>${esc(project.categoryLabel)}</p>
                        </div>
                    </a>
                    ${meta}
                </div>`;
}

function ldrCard(depth) {
  const p = prefixForDepth(depth);
  return `                <div class="col-lg-4 col-md-6 portfolio-item wow fadeInUp" data-wow-delay="0.1s">
                    <div class="portfolio-card h-100">
                        ${placeholderFigure(LDR_CARD.name)}
                        <div class="portfolio-info">
                            <h4>${esc(LDR_CARD.name)}</h4>
                            <p>${esc(LDR_CARD.categoryLabel)}</p>
                        </div>
                    </div>
                    <p class="text-muted small mb-2">${esc(LDR_CARD.descriptor)}</p>
                    <a href="${p}contact" class="btn btn-sm btn-outline-primary">Discuss this work</a>
                </div>`;
}

function buildIndex() {
  const depth = 0;
  const p = prefixForDepth(depth);
  const indexableForList = CASE_STUDIES.filter((c) => !c.robots);
  const itemList = {
    "@type": "ItemList",
    itemListElement: indexableForList.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE}/portfolio/${c.slug}`,
    })),
  };
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: INDEX_META.title,
    description: INDEX_META.description,
    url: INDEX_META.canonical,
    mainEntity: itemList,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: INDEX_META.canonical },
    ],
  };
  const featured = CASE_STUDIES.filter((c) => c.indexFeatured);
  const supporting = CASE_STUDIES.filter((c) => !c.indexFeatured);

  const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>${esc(INDEX_META.title)}</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="VIIX Solutions, portfolio, case studies, technology, digital growth" name="keywords">
    <meta content="${esc(INDEX_META.description)}" name="description">

    <link href="img/logo/viixlogofull.png" rel="icon" type="image/png">
${seoBlock({
  title: INDEX_META.title,
  description: INDEX_META.description,
  canonical: INDEX_META.canonical,
  robots: null,
  jsonLdArray: [orgJsonLd(), collection, breadcrumb],
})}

${headAssets(depth)}
</head>

<body>
    <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner"></div>
    </div>

${topbarHtml(depth)}

    <div class="container-fluid position-relative p-0">
        <nav class="navbar navbar-expand-xl navbar-dark px-5 py-3 py-xl-0">
            <a href="./" class="navbar-brand p-0 d-flex align-items-center gap-2">
                <img src="img/logo/viixlogoshape.png" alt="" class="brand-logo brand-logo-shape">
                <img src="img/logo/viixlogotext.png" alt="VIIX Solutions" class="brand-logo brand-logo-text">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="fa fa-bars" aria-hidden="true"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <div class="navbar-nav ms-auto py-0">${navHtml(depth, "portfolio")}
                </div>
                <div class="d-xl-none py-2 region-switcher-nav">
                    <a class="me-2 text-white" href="en-ng" data-viix-region="en-ng">Nigeria &amp; West Africa</a>
                    <span class="text-white-50 me-2">|</span>
                    <a class="text-white" href="en-za" data-viix-region="en-za">Southern Africa</a>
                </div>
                <a href="quote" class="btn btn-primary py-2 px-4 ms-xl-3">Book an Assessment</a>
            </div>
        </nav>

        <div class="container-fluid bg-primary py-5 bg-header" style="margin-bottom: 90px;">
            <div class="row py-5">
                <div class="col-12 pt-lg-5 mt-lg-5 text-center">
                    <h1 class="display-4 text-white animated zoomIn">Portfolio</h1>
                    <a href="./" class="h5 text-white">Home</a>
                    <i class="far fa-circle text-white px-2"></i>
                    <span class="h5 text-white">Portfolio</span>
                </div>
            </div>
        </div>
    </div>

    <main id="main-content">
    <div class="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div class="container py-5">
            <div class="section-title position-relative pb-3 mb-5 mx-auto text-center" style="max-width: 720px;">
                <h5 class="fw-bold text-primary text-uppercase">Selected Work</h5>
                <h2 class="mb-3">Evidence-Led Projects Across Technology and Digital Growth</h2>
                <p class="mb-0">${esc(INDEX_META.description)}</p>
            </div>
        </div>
    </div>

    <div class="container-fluid service-showcase pb-5 wow fadeInUp" data-wow-delay="0.1s">
        <div class="container pb-5">
            <div class="section-title position-relative pb-3 mb-4">
                <h5 class="fw-bold text-primary text-uppercase">Featured</h5>
                <h2 class="mb-0">Editorial Highlights</h2>
            </div>
            <div class="row g-4">
${featured.map((c) => portfolioCard(c, depth)).join("\n")}
            </div>
        </div>
    </div>

    <div class="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div class="container py-5">
            <div class="section-title position-relative pb-3 mb-4">
                <h5 class="fw-bold text-primary text-uppercase">Client Engagements &amp; Products</h5>
                <h2 class="mb-0">More From the Portfolio</h2>
            </div>
            <div class="row g-4">
${supporting.map((c) => portfolioCard(c, depth)).join("\n")}
${ldrCard(depth)}
            </div>
            <div class="text-center mt-5">
                <a href="quote" class="btn btn-primary py-3 px-5 me-3">Book an Assessment</a>
                <a href="contact" class="btn btn-outline-primary py-3 px-5">Contact VIIX</a>
            </div>
        </div>
    </div>
    </main>

${footerHtml(depth)}

    <a href="#" class="btn btn-lg btn-primary btn-lg-square rounded back-to-top" aria-label="Back to top"><i class="bi bi-arrow-up" aria-hidden="true"></i></a>

${scriptsHtml(depth)}
</body>

</html>
`;
  return html;
}

function serviceLinks(project, depth) {
  const p = prefixForDepth(depth);
  return project.services
    .map((s) => `<a href="${p}${s.href.replace(/^\//, "")}" class="me-3">${esc(s.label)}</a>`)
    .join("");
}

function buildCaseStudy(project) {
  const depth = 1;
  const p = prefixForDepth(depth);
  const canonical = `${SITE}/portfolio/${project.slug}`;
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: project.seo.title,
    description: project.seo.description,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "VIIX Solutions", url: `${SITE}/` },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE}/portfolio` },
      { "@type": "ListItem", position: 3, name: project.name },
    ],
  };

  const metaLine = project.geography
    ? `<p class="text-muted mb-4"><span class="text-uppercase small fw-bold">${esc(project.categoryLabel)}</span> · ${esc(project.geography)}</p>`
    : `<p class="text-muted mb-4"><span class="text-uppercase small fw-bold">${esc(project.categoryLabel)}</span></p>`;

  const outcomeBlock = project.outcome
    ? `            <div class="mb-5">
                <h2 class="mb-3">Outcome</h2>
                <p class="mb-0 border-start border-primary border-4 ps-3 fst-italic">${esc(project.outcome)}</p>
            </div>`
    : `            <div class="mb-5">
                <h2 class="mb-3">What We Delivered</h2>
                <p class="mb-0">${esc(project.delivered)}</p>
            </div>`;

  const testimonialBlock = project.testimonial
    ? `            <div class="mb-5">
                <h2 class="mb-3">Client Voice</h2>
                <blockquote class="bg-light rounded p-4 mb-0">
                    <p class="mb-2 fst-italic quote-marks">"${esc(project.testimonial.quote)}"</p>
                    <footer class="text-primary fw-semibold">— ${esc(project.testimonial.attribution)}</footer>
                </blockquote>
            </div>`
    : "";

  const limitationBlock = project.limitation
    ? `            <div class="mb-5 p-4 rounded" style="background: var(--light); border-left: 3px solid var(--primary);">
                <p class="mb-0 small">${esc(project.limitation)}</p>
            </div>`
    : "";

  const relatedBlock =
    project.related && project.related.length
      ? `            <div class="mb-5">
                <h2 class="mb-3">Related Work</h2>
                <div class="d-flex flex-column gap-2">
${project.related
  .map(
    (r) =>
      `                    <a href="${p}portfolio/${r.slug}">${esc(r.name)}</a>`
  )
  .join("\n")}
                </div>
            </div>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>${esc(project.seo.title)}</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="VIIX Solutions, ${esc(project.name)}, portfolio" name="keywords">
    <meta content="${esc(project.seo.description)}" name="description">

    <link href="../img/logo/viixlogofull.png" rel="icon" type="image/png">
${seoBlock({
  title: project.seo.title,
  description: project.seo.description,
  canonical,
  robots: project.robots,
  jsonLdArray: [orgJsonLd(), webPage, breadcrumb],
})}

${headAssets(depth)}
</head>

<body>
    <div id="spinner" class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner"></div>
    </div>

${topbarHtml(depth)}

    <div class="container-fluid position-relative p-0">
        <nav class="navbar navbar-expand-xl navbar-dark px-5 py-3 py-xl-0">
            <a href="../" class="navbar-brand p-0 d-flex align-items-center gap-2">
                <img src="../img/logo/viixlogoshape.png" alt="" class="brand-logo brand-logo-shape">
                <img src="../img/logo/viixlogotext.png" alt="VIIX Solutions" class="brand-logo brand-logo-text">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="fa fa-bars" aria-hidden="true"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <div class="navbar-nav ms-auto py-0">${navHtml(depth, "portfolio")}
                </div>
                <div class="d-xl-none py-2 region-switcher-nav">
                    <a class="me-2 text-white" href="../en-ng" data-viix-region="en-ng">Nigeria &amp; West Africa</a>
                    <span class="text-white-50 me-2">|</span>
                    <a class="text-white" href="../en-za" data-viix-region="en-za">Southern Africa</a>
                </div>
                <a href="../quote" class="btn btn-primary py-2 px-4 ms-xl-3">Book an Assessment</a>
            </div>
        </nav>

        <div class="container-fluid bg-primary py-5 bg-header" style="margin-bottom: 90px;">
            <div class="row py-5">
                <div class="col-12 pt-lg-5 mt-lg-5 text-center">
                    <h1 class="display-4 text-white animated zoomIn">${esc(project.name)}</h1>
                    <a href="../" class="h5 text-white">Home</a>
                    <i class="far fa-circle text-white px-2"></i>
                    <a href="../portfolio" class="h5 text-white">Portfolio</a>
                    <i class="far fa-circle text-white px-2"></i>
                    <span class="h5 text-white">${esc(project.name)}</span>
                </div>
            </div>
        </div>
    </div>

    <main id="main-content">
    <div class="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div class="container py-5">
            <div class="row g-5">
                <div class="col-lg-7">
${metaLine}
                    <p class="lead">${esc(project.descriptor)}</p>
                    <h2 class="mb-3">Context</h2>
                    <p>${esc(project.context)}</p>
                    <h2 class="mb-3">VIIX Intervention</h2>
                    <p>${esc(project.intervention)}</p>
${outcomeBlock}
${testimonialBlock}
                    <h2 class="mb-3">Capabilities</h2>
                    <p class="mb-4">${serviceLinks(project, depth)}</p>
${relatedBlock}
${limitationBlock}
                    <a href="../portfolio" class="btn btn-outline-primary me-3">Back to Portfolio</a>
                    <a href="../contact" class="btn btn-outline-primary me-3">Contact VIIX</a>
                    <a href="../quote" class="btn btn-primary">Book an Assessment</a>
                </div>
                <div class="col-lg-5">
                    <div class="portfolio-card mb-4">
                        ${projectFigure(project, depth, "hero")}
                    </div>
                    ${visualPendingNote(project)}
                </div>
            </div>
        </div>
    </div>
    </main>

${footerHtml(depth)}

    <a href="#" class="btn btn-lg btn-primary btn-lg-square rounded back-to-top" aria-label="Back to top"><i class="bi bi-arrow-up" aria-hidden="true"></i></a>

${scriptsHtml(depth)}
</body>

</html>
`;
  return html;
}

function main() {
  const created = [];
  fs.mkdirSync(PORTFOLIO_DIR, { recursive: true });

  const indexPath = path.join(ROOT, "portfolio.html");
  fs.writeFileSync(indexPath, buildIndex(), "utf8");
  created.push("portfolio.html");

  for (const project of CASE_STUDIES) {
    const filePath = path.join(PORTFOLIO_DIR, `${project.slug}.html`);
    fs.writeFileSync(filePath, buildCaseStudy(project), "utf8");
    created.push(path.join("portfolio", `${project.slug}.html`).replace(/\\/g, "/"));
  }

  console.log(JSON.stringify({ ok: true, files: created }, null, 2));
}

main();
