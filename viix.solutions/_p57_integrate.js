const fs = require('fs');
const path = require('path');

const root = __dirname;

function walkHtml(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (name === 'portfolio' || name.startsWith('_p')) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walkHtml(p, files);
    else if (name.endsWith('.html') && name !== '404.html') files.push(p);
  }
  return files;
}

function patchNav(html, depth, inRegional) {
  const pf = depth === 0 ? 'portfolio' : inRegional ? '../portfolio' : '../'.repeat(depth) + 'portfolio';
  if (html.includes('href="' + pf + '" class="nav-item nav-link">Portfolio</a>')) return html;
  const aboutHref = inRegional ? 'about' : depth === 0 ? 'about' : '../'.repeat(depth) + 'about';
  const serviceHref = inRegional ? 'service' : depth === 0 ? 'service' : '../'.repeat(depth) + 'service';
  const aboutRe = new RegExp('(<a href="' + aboutHref.replace(/\//g, '\\/') + '" class="nav-item nav-link[^"]*">About</a>\\s*\\n\\s*)(<a href="' + serviceHref.replace(/\//g, '\\/') + '")');
  if (!aboutRe.test(html)) return html;
  return html.replace(aboutRe, `$1<a href="${pf}" class="nav-item nav-link">Portfolio</a>\n                    $2`);
}

function patchFooter(html, depth) {
  const pf = depth === 0 ? 'portfolio' : '../'.repeat(depth) + 'portfolio';
  if (html.includes('href="' + pf + '"><i class="bi bi-arrow-right text-primary me-2"></i>Portfolio</a>')) return html;
  const footRe = depth === 0
    ? /(<a class="text-light mb-2" href="about"><i class="bi bi-arrow-right text-primary me-2"><\/i>About<\/a>\s*\n\s*)(<a class="text-light mb-2" href="service")/
    : new RegExp('(<a class="text-light mb-2" href="' + '../'.repeat(depth) + 'about"><i class="bi bi-arrow-right text-primary me-2"></i>About</a>\\s*\\n\\s*)(<a class="text-light mb-2" href="' + '../'.repeat(depth) + 'service")');
  if (!footRe.test(html)) return html;
  return html.replace(footRe, `$1<a class="text-light mb-2" href="${pf}"><i class="bi bi-arrow-right text-primary me-2"></i>Portfolio</a>\n                        $2`);
}

const files = walkHtml(root);
let navCount = 0;
for (const file of files) {
  const rel = path.relative(root, file);
  const depth = rel.split(path.sep).length - 1;
  const inRegional = /^en-(ng|za)[\\/]/.test(rel);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = patchNav(html, depth, inRegional);
  html = patchFooter(html, depth);
  if (html !== before) {
    fs.writeFileSync(file, html);
    navCount++;
  }
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const portfolioUrls = [
  'https://www.viix.solutions/portfolio',
  'https://www.viix.solutions/portfolio/sunshine-macaroni',
  'https://www.viix.solutions/portfolio/pjs-foods',
  'https://www.viix.solutions/portfolio/cdr-electrical',
  'https://www.viix.solutions/portfolio/living-vine-ministries',
  'https://www.viix.solutions/portfolio/cdr-technical',
  'https://www.viix.solutions/portfolio/sisonke-africa',
  'https://www.viix.solutions/portfolio/vessa',
];
for (const url of portfolioUrls) {
  if (!sitemap.includes(url)) {
    sitemap = sitemap.replace('</urlset>', `  <url>\n    <loc>${url}</loc>\n  </url>\n</urlset>`);
  }
}
fs.writeFileSync(sitemapPath, sitemap);

const portfolioDir = path.join(root, 'portfolio');
for (const name of fs.readdirSync(portfolioDir)) {
  if (!name.endsWith('.html')) continue;
  const p = path.join(portfolioDir, name);
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/\.\.\/\.\//g, '../');
  fs.writeFileSync(p, html);
}

console.log('Nav/footer patched on', navCount, 'pages');
console.log('Sitemap updated with', portfolioUrls.length, 'portfolio URLs');
