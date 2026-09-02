const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

const root = path.join(__dirname);
const issues = [];

function add(sev, page, msg) {
  issues.push({ sev, page, msg });
}

const indexable = [
  '/portfolio',
  '/portfolio/sunshine-macaroni',
  '/portfolio/pjs-foods',
  '/portfolio/cdr-electrical',
  '/portfolio/living-vine-ministries',
  '/portfolio/cdr-technical',
  '/portfolio/sisonke-africa',
  '/portfolio/vessa',
];

function fileForRoute(route) {
  if (route === '/portfolio') return path.join(root, 'portfolio', 'index.html');
  return path.join(root, route.replace('/portfolio/', 'portfolio/') + '.html');
}

// --- SEO file audit ---
for (const route of indexable) {
  const file = fileForRoute(route);
  const html = fs.readFileSync(file, 'utf8');
  const canon = html.match(/rel="canonical" href="([^"]+)"/);
  const expected = `https://www.viix.solutions${route}`;
  if (!canon) add('P1', route, 'Missing canonical');
  else if (canon[1] !== expected) add('P1', route, `Canonical mismatch: ${canon[1]} vs ${expected}`);
  if (/noindex/i.test(html)) add('P1', route, 'Unexpected noindex on indexable page');
  const title = html.match(/<title>([^<]+)<\/title>/);
  if (!title || title[1].length < 10) add('P1', route, 'Missing/short title');
  const desc = html.match(/name="description"[^>]*content="([^"]+)"/) || html.match(/content="([^"]+)"[^>]*name="description"/);
  if (!desc) add('P1', route, 'Missing meta description');
  if (/aggregateRating|reviewCount|ratingValue/.test(html)) add('P0', route, 'Fabricated review schema');
}

const posflyt = fs.readFileSync(path.join(root, 'portfolio/posflyt.html'), 'utf8');
if (!/noindex/i.test(posflyt)) add('P1', '/portfolio/posflyt', 'Missing noindex');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
if (sitemap.includes('portfolio/posflyt')) add('P1', 'sitemap', 'POSflyt in sitemap despite noindex');
for (const route of indexable) {
  const url = `https://www.viix.solutions${route}`;
  if (!sitemap.includes(url)) add('P1', 'sitemap', `Missing ${url}`);
}

// --- Content governance strings ---
const forbidden = [
  [/\+?\d+%\s*(productivity|efficiency|growth)/i, 'numeric outcome metric'],
  [/best digital agency/i, 'vanity keyword'],
  [/cheap website/i, 'vanity keyword'],
  [/paying customers(?!\s+revenue)/i, 'check context'], // vessa disclaimer OK
];
const portfolioFiles = ['portfolio/index.html', ...fs.readdirSync(path.join(root, 'portfolio')).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => `portfolio/${f}`)];
for (const rel of portfolioFiles) {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  if (/portfolio\/cdr-technical/.test(html) && rel.includes('cdr-electrical')) {
    if (/<a[^>]+cdr-technical/.test(html)) add('P1', rel, 'CDR Electrical links to CDR Technical');
  }
  if (/portfolio\/cdr-electrical/.test(html) && rel.includes('cdr-technical')) {
    if (/<a[^>]+cdr-electrical/.test(html)) add('P1', rel, 'CDR Technical links to CDR Electrical');
  }
  for (const [re, label] of forbidden) {
    if (re.test(html) && !rel.includes('vessa') && !/does not claim|not claimed|without quantified/i.test(html)) {
      add('P1', rel, `Possible forbidden content: ${label}`);
    }
  }
}
if (fs.existsSync(path.join(root, 'portfolio/ldr.html'))) add('P0', 'routes', 'LDR standalone page exists');

// --- Internal link extraction ---
function extractHrefs(html, baseFile) {
  const hrefs = [...html.matchAll(/href="([^"#?]+)"/g)].map(m => m[1]);
  return hrefs;
}

for (const rel of portfolioFiles) {
  const file = path.join(root, rel);
  const html = fs.readFileSync(file, 'utf8');
  const depth = rel.startsWith('portfolio/') ? 1 : 0;
  for (const href of extractHrefs(html, rel)) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href === '#') continue;
    let target;
    if (href.startsWith('/')) target = path.join(root, href.slice(1) + '.html');
    else target = path.normalize(path.join(path.dirname(file), href));
    // cleanUrls: also try without .html
    const candidates = [target, target.replace(/\.html$/, '') + '.html'];
    if (href.endsWith('/')) candidates.push(path.join(target, 'index.html'));
    const ok = candidates.some(c => {
      if (fs.existsSync(c)) return true;
      if (fs.existsSync(c + '.html')) return true;
      return false;
    });
    if (!ok && !href.includes('en-ng') && !href.includes('en-za')) {
      // regional paths resolve to folders
    }
    if (!ok) {
      const relTarget = path.relative(root, target);
      if (!fs.existsSync(target) && !fs.existsSync(target + '.html') && !fs.existsSync(path.join(target, 'index.html'))) {
        if (/^\.\./.test(href) || !href.includes('://')) {
          const alt = path.normalize(path.join(path.dirname(file), href));
          const altHtml = alt.endsWith('.html') ? alt : alt + '.html';
          if (!fs.existsSync(altHtml) && href !== './' && href !== '../') {
            add('P2', rel, `Broken local href: ${href}`);
          }
        }
      }
    }
  }
}

// --- Title uniqueness ---
const titles = {};
for (const rel of portfolioFiles) {
  const html = fs.readFileSync(path.join(root, rel), 'utf8');
  const t = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (t) {
    if (titles[t]) add('P1', rel, `Duplicate title with ${titles[t]}`);
    titles[t] = rel;
  }
}

const out = {
  generated: new Date().toISOString(),
  issueCount: issues.length,
  issues,
  indexableCount: indexable.length,
  posflytNoindex: /noindex/i.test(posflyt),
  vessaIndexable: !/noindex/i.test(fs.readFileSync(path.join(root, 'portfolio/vessa.html'), 'utf8')),
};
fs.writeFileSync(path.join(root, '_p58_qa.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
